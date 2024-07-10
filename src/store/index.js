import { createStore } from 'vuex';
import { toRaw } from 'vue';
import baseData from "../content/workers.json";

const MAX_LEVEL_CAP = 20;
const UPGRADE_WAVE_SHIFT = -48;

export default createStore({
    state: {
        coins: 0,
        basicFarm: 250,
        chanceType: 0,
        stones: baseData.stones,
        tierMap: baseData.tierMap,
    },
    mutations: {
        setCoins(state, amount) {
            state.coins = amount;
        },
        setStones(state, stones) {
            state.stones = stones;
        },
        setProgress(state, { stoneId, progress }) {
            const stone = state.stones[stoneId];
            if (stone) stone.progress = progress;
        },
        setIsProgressing(state, { stoneId, isProgressing }) {
            const stone = state.stones[stoneId];
            if (stone) stone.isProgressing = isProgressing;
        },
        setTier(state, { stoneId }) {
            const stone = state.stones[stoneId];
            if (stone) {
                const tier = Math.floor(stone.level / stone.levelCap);
                stone.tier = tier;
            }
        },
        setChance(state, { stoneId }) {
            const stone = state.stones[stoneId];
            if (stone) {
                const tier = stone.tier
                stone.chance = tier / MAX_LEVEL_CAP;
            }
        },
        setAbsoluteChance(state) {
            state.stones.slice().reverse().forEach((stone, index, array) => {
                if (index === 0) {
                    stone.absoluteChance = stone.chance
                } else {
                    let product = array.slice().reverse().slice(0, index).reduce((acc, val) => acc.chance * (1 - val.chance), 1);
                    console.log("product", product)
                    stone.absoluteChance = stone.chance * product;
                }
                console.log("chance", stone.chance, "absChance", stone.absoluteChance)
            });

        },
        setChanceType(state) {
            const chanceType = state.chanceType;
            state.chanceType = (chanceType + 1) % 2

        },
        setIntervalId(state, { stoneId, intervalId }) {
            const stone = state.stones[stoneId];
            if (stone) stone.intervalId = intervalId;
        },
        incrementStoneLevel(state, stoneId) {
            const stone = state.stones[stoneId];
            if (stone) stone.level++;
        },
        incrementStoneAmount(state, stoneId) {
            const stone = state.stones[stoneId];
            if (stone) stone.amount++;
        },
        incrementUpgradePrice(state, { stoneId }) {
            const stone = state.stones[stoneId];
            if (stone) {
                stone.actualUpgradePrice = stone.upgradePrice * Math.pow(1.05, stone.level);
            }
        },
        incrementStoneValue(state, { stoneId }) {
            const stone = state.stones[stoneId];
            if (stone) {
                stone.actualValue = stone.value * Math.pow(1.05, stone.level);
            }
        },
        decrementStoneAmount(state, stoneId) {
            const stone = state.stones[stoneId];
            if (stone) stone.amount--;
        },
        incrementCoins(state, amount) {
            state.coins += amount;
        },
        decrementCoins(state, amount) {
            state.coins -= amount;
        },
        activateStone(state, stoneId) {
            const stone = state.stones[stoneId];
            if (stone) stone.active = true;
        },

    },
    actions: {
        initializeStones({ commit, state }) {
            const initializedStones = state.stones.map((stone, index) => ({
                ...stone,
                id: index,
                level: 0,
                amount: 0,
                active: index == 0,
                progress: 0,
                isProgressing: false,
                intervalId: null,
                tier: 0,
                actualUpgradePrice: stone.upgradePrice,
                actualValue: stone.value,
                chance: 0,
                absoluteChance: 0
            }));
            commit('setStones', initializedStones);

        },

        loadGame({ commit }) {
            const cookies = document.cookie.split('; ').find(row => row.startsWith('alpha_gameStatus='));
            const jsonString = cookies ? cookies.split('=')[1] : null;

            if (jsonString) {
                const gameStatus = JSON.parse(jsonString);
                commit('setCoins', gameStatus.coins);
                commit('setStones', gameStatus.stones);
                /* state.stones.forEach((stone) => {
                    dispatch('setProgressLevel', stone.id);
                }); */
            } else {
                console.error('No saved game found.');
            }
            return jsonString;
        },
        saveGame({ state }) {
            const gameStatus = {
                coins: state.coins,
                stones: toRaw(state.stones)
            };
            const jsonString = JSON.stringify(gameStatus);
            document.cookie = `alpha_gameStatus=${jsonString}`;
        },
        upgradeStone({ commit, dispatch, state }, { stoneId, paymentAmount }) {
            if (state.coins >= paymentAmount) {
                commit('decrementCoins', paymentAmount);
                commit('incrementStoneLevel', stoneId);
                commit('setTier', { stoneId });
                commit('setChance', { stoneId });
                commit('setAbsoluteChance', { stoneId });
                commit('incrementUpgradePrice', { stoneId });
                commit('incrementStoneValue', { stoneId });
                dispatch('setProgressLevel', { stoneId, upgraded: true });
            }
        },
        sellStone({ commit, state }, stoneId) {
            const stone = state.stones[stoneId]
            if (!stone || stone.amount <= 0 || stone.isProgressing) return;


            commit('setProgress', { stoneId, progress: 0 });
            commit('setIsProgressing', { stoneId, isProgressing: true });
            const intervalDuration = 100;
            const progressIncrement = 100 / ((stone.speed * 1000) / intervalDuration);
            const intervalId = setInterval(() => {

                let currentProgress = state.stones.find(s => s.id === stoneId).progress;
                currentProgress += progressIncrement;

                if (currentProgress >= 100) {
                    commit('incrementCoins', stone.actualValue);
                    commit('decrementStoneAmount', stoneId);
                    commit('setProgress', { stoneId, progress: 100 });
                    clearInterval(state.stones.find(s => s.id === stoneId).intervalId);
                    setTimeout(() => {
                        commit('setProgress', { stoneId, progress: 0 });
                        commit('setIsProgressing', { stoneId, isProgressing: false });
                    }, 100);
                } else {
                    commit('setProgress', { stoneId, progress: currentProgress });
                }
            }, intervalDuration);

            commit('setIntervalId', { stoneId, intervalId });


            const nextInactiveStone = state.stones.find(w => !w.active);
            if (nextInactiveStone && state.coins >= nextInactiveStone.upgradePrice) {
                commit('activateStone', nextInactiveStone.id);
            }
        },

        farmStone({ commit, state, dispatch }) {
            commit('incrementCoins', state.basicFarm);
            commit('incrementStoneAmount', 0);
            dispatch('saveGame');
            console.log(state)
        },
        setProgressLevel({ state }, { stoneId, upgraded = false }) {
            console.log(upgraded)
            const stone = state.stones.find(stone => stone.id === stoneId);
            if (!stone) return;

            const progressContainer = document.getElementById(`progress-container-${stoneId}`);
            if (!progressContainer) return;

            const progressWave = progressContainer.querySelector(".progress-wave");
            if (!progressWave) return;

            const level = stone.level;
            const maxLevel = stone.levelCap;
            let percentage = level % maxLevel == 0 && upgraded ? UPGRADE_WAVE_SHIFT : level % maxLevel / maxLevel * UPGRADE_WAVE_SHIFT

            progressWave.style.transform = `translateY(${percentage}%)`;

            if (percentage === UPGRADE_WAVE_SHIFT) {
                setTimeout(function() {
                    progressWave.style.transform = `translateY(0)`;
                    progressContainer.classList.add("upgraded");
                    progressContainer.addEventListener("animationend", function() {
                        progressContainer.classList.remove("upgraded");
                    });
                }, 200);
            }
        },

        changeChanceType({ commit }) {
            commit('setChanceType');
        },

    },
    getters: {
        coins: state => state.coins,
        stones: state => state.stones,
        getStoneAmountById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.amount : 0;
        },
        getStoneNameById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.name : "Lorem";
        },
        getStoneValueById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.actualValue : 0;
        },
        getStoneActiveById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.active : false;
        },
        getProgressById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.progress : 0;
        },
        getProgressingById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.isProgressing : 0;
        },
        getTierById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.tier : 0;
        },
        getChanceById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            const chanceType = state.chanceType;
            switch (chanceType) {
                case 0:
                    return stone ? stone.chance : 0;
                case 1:
                    return stone ? stone.absoluteChance : 0;
                default:
                    break;
            }
        },
        getActualUpgradePriceById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.actualUpgradePrice : 0;
        },
        stoneById: (state) => (id) => {
            return state.stones.find(stone => stone.id === id);
        },
        tierMap: (state) => state.tierMap,
    },

});