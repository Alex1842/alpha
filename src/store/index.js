import { createStore } from 'vuex';
import { toRaw } from 'vue';

import baseData from "../content/workers.json";

const MAX_LEVEL_CAP = 20;
const UPGRADE_WAVE_SHIFT = -45;

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
        setAbsoluteChance(state, stoneId) {
            const stoneList = state.stones;
            const stone = stoneList[stoneId];
            if (stoneId == stoneList.length) {
                stone.absoluteChance = stone.chance;
                return;

            }
            if (stoneId == 0) {
                let result = 0;
                for (let i = 1; i < stoneList.length; i++) {
                    result += stoneList[i].absoluteChance;

                }
                stone.absoluteChance = 1 - result;
                return
            }
            let product = 1;
            for (let i = stoneId + 1; i < stoneList.length; i++) {
                product *= (1 - stoneList[i].chance);

            }

            stone.absoluteChance = stone.chance * product;
            state.stones = [...stoneList];
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
                commit('incrementUpgradePrice', { stoneId });
                commit('incrementStoneValue', { stoneId });
                dispatch('calcAbsoluteChance');
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
                        const nextInactiveStone = state.stones.find(w => !w.active);
                        if (nextInactiveStone && state.coins >= nextInactiveStone.upgradePrice) {
                            commit('activateStone', nextInactiveStone.id);
                        }
                    }, 100);
                } else {
                    commit('setProgress', { stoneId, progress: currentProgress });
                }
            }, intervalDuration);
            commit('setIntervalId', { stoneId, intervalId });
        },

        farmStone({ commit, state, dispatch }, stoneId) {
            console.log(state)
            commit('incrementCoins', state.basicFarm);
            commit('incrementStoneAmount', stoneId);
            dispatch('saveGame');

        },
        setProgressLevel({ state, getters }, { stoneId, upgraded = false }) {
            const stone = state.stones.find(stone => stone.id === stoneId);

            if (!stone) return;

            const progressContainer = document.getElementById(`progress-container-${stoneId}`);
            if (!progressContainer) return;

            const progressWave = progressContainer.querySelector(".progress-wave");
            if (!progressWave) return;

            const level = stone.level;
            const maxLevel = stone.levelCap;
            let percentage = level % maxLevel / maxLevel * UPGRADE_WAVE_SHIFT
            if (level % maxLevel == 0 && upgraded || !getters.isUpgradeAvailable(stoneId)) {
                percentage = UPGRADE_WAVE_SHIFT
            }
            progressWave.style.transform = `translateY(${percentage}%)`;
            if (percentage === UPGRADE_WAVE_SHIFT && getters.isUpgradeAvailable(stoneId)) {
                setTimeout(function() {
                    progressWave.style.transform = `translateY(0)`;
                    progressContainer.classList.add("upgraded");
                    progressContainer.addEventListener("animationend", function() {
                        progressContainer.classList.remove("upgraded");
                    });
                }, 200);
            }
        },
        calcAbsoluteChance({ commit, state }) {
            const stoneList = state.stones
            for (let i = stoneList.length - 1; i >= 0; i--) {
                commit('setAbsoluteChance', stoneList[i].id);
            }
            state.stones = [...stoneList];
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
        getStoneImageById: (state) => (stoneId) => {
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
        getChanceType: (state) => {
            return state.chanceType;
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
        getRandomStone: (state) => {
            const random = Math.random();
            let cumulativeSum = 0;
            console.log(state.stones.map(s => s.absoluteChance))
            for (let i = 0; i < state.stones.length; i++) {
                cumulativeSum += state.stones[i].absoluteChance;
                if (random < cumulativeSum) {
                    return state.stones[i].id;
                }
            }
            return state.stones[0].id;

        },
        getActualUpgradePriceById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.actualUpgradePrice : 0;
        },
        stoneById: (state) => (id) => {
            return state.stones.find(stone => stone.id === id);
        },
        tierMap: (state) => state.tierMap,
        isUpgradeAvailable: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return MAX_LEVEL_CAP > stone.tier;
        }
    },

});