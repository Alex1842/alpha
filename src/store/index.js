import { createStore } from 'vuex';
import { toRaw } from 'vue';
import stoneList from "../content/workers.json";

const MAX_LEVEL_CAP = 20;

export default createStore({
    state: {
        coins: 0,
        basicFarm: 250,
        stones: stoneList,
        tierMap: {
            0: "red",
            1: "green",
            2: "blue",
            3: "yellow",
            4: "pink",
        },
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
                active: index > -1,
                progress: 0,
                isProgressing: false,
                intervalId: null,
                tier: 0,
                actualUpgradePrice: stone.upgradePrice,
                actualValue: stone.value,
                chance: 0,
                absoluteChance: 0
            }));
            console.log(initializedStones)
            commit('setStones', initializedStones);

        },
        /* initializeChanceList({ commit, state, dispatch }) {
            let chanceList = [];

            const stonesWithRef = state.stones.filter((item) => {
                const stoneRef = this.$refs["stoneComponent-" + item.id];
                return stoneRef && stoneRef.length > 0;
            });
            stonesWithRef.forEach((item) => {
                const stoneComponent = this.$refs["stoneComponent-" + item.id][0];
                chanceList.push(stoneComponent.currentChance);
            });
            commit('setChanceList', chanceList);
            dispatch('initializeAbsoluteChanceList');
            console.log(state)
        }, */
        /* initializeAbsoluteChanceList({ commit, state }) {
            const conditionalChances = [];
            let prevProbability = 1.0;
            for (let i = state.chanceList.length - 1; i >= 0; i--) {
                const currentProbability = state.chanceList[i] * prevProbability;
                conditionalChances.push(currentProbability);
                prevProbability *= 1 - state.chanceList[i];
            }
            const absolutechanceList = conditionalChances.reverse();
            commit('setAbsoluteChanceList', absolutechanceList);
        }, */
        loadGame({ commit }) {
            const cookies = document.cookie.split('; ').find(row => row.startsWith('alpha_gameStatus='));
            const jsonString = cookies ? cookies.split('=')[1] : null;

            if (jsonString) {
                const gameStatus = JSON.parse(jsonString);
                //console.log(gameStatus)
                commit('setCoins', gameStatus.coins);
                commit('setStones', gameStatus.stones);
                //console.log(gameStatus.stones)
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
        upgradeStone({ commit, state }, { stoneId, paymentAmount }) {
            if (state.coins >= paymentAmount) {
                commit('decrementCoins', paymentAmount);
                commit('incrementStoneLevel', stoneId);
                commit('setTier', { stoneId });
                commit('setChance', { stoneId });
                commit('incrementUpgradePrice', { stoneId });
                commit('incrementStoneValue', { stoneId });
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
        /* setProgressLevel({ commit, getters }, stoneId) {
            const stone = getters.stoneById(stoneId);
            if (!stone) return;

            const percentage = getters.currentTier(stoneId).percentage;
            const newTier = getters.currentTier(stoneId).tier;

            commit('setProgress', { stoneId, progress: percentage });
            if (percentage === 0) {
                commit('setTier', { stoneId, tier: newTier });
            }
        } */
    },
    getters: {
        coins: state => state.coins,
        stones: state => state.stones,
        getStoneAmountById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            //console.log(stone)
            return stone ? stone.amount : 0;
        },
        getStoneNameById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.name : "Lorem";
        },
        getStoneValueById: (state) => (stoneId) => {
            console.log(state)
            const stone = state.stones[stoneId];
            return stone ? stone.actualValue : 0;
        },
        getProgressById: (state) => (stoneId) => {
            console.log(state)
            const stone = state.stones[stoneId];
            return stone ? stone.progress : 0;
        },
        getTierById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.tier : 0;
        },
        getChanceById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.chance : 0;
        },
        getActualUpgradePriceById: (state) => (stoneId) => {
            const stone = state.stones[stoneId];
            return stone ? stone.actualUpgradePrice : 0;
        },
        stoneById: (state) => (id) => {
            return state.stones.find(stone => stone.id === id);
        },
        currentTier: (state, getters) => (id) => {
            const stone = getters.stoneById(id);
            if (!stone) return { percentage: 0, tier: 0 };
            const level = stone.level;
            const maxLevel = stone.levelCap;
            const tier = Math.floor(level / maxLevel);
            let percentage = 50 - ((level % maxLevel) / maxLevel) * 50;
            if (level !== 0 && level % maxLevel === 0) {
                percentage = 0;
            }
            return { percentage, tier };
        },
        tierMap: (state) => state.tierMap,
    },

});