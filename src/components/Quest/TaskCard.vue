<template>
    <div class="card-container">
        <div class="title">
            <img src="@/assets/task-dot.svg" alt="task dot">
            <p>{{ title }}</p>
        </div>
        <div class="difficulty" v-if="showDifficulty">
            <img v-if="difficulty == 1" src="@/assets/easy.svg" alt="easy">
            <img v-if="difficulty == 2" src="@/assets/medium.svg" alt="medium">
            <img v-if="difficulty == 3" src="@/assets/hard.svg" alt="hard">
        </div>
        <div class="buttons-container" v-if="showActions">
            <button @click="$emit('select', id)">i</button>
            <button @click="$emit('done', id)">Done</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "task-card",
   
    props: {
        title: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        difficulty: {
            type: Number,
            required: false,
        },
        showDifficulty: {
            type: Boolean,
            required: false,
            default:false
        },
        showActions: {
            type: Boolean,
            required: false,
            default:false
        }
    },
}
</script>

<style lang="scss" scoped>
p {
    padding: 0;
    margin: 0;
}

.card-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 62px;
    cursor: pointer;
    background-color: #162041;
    margin: 18px 0;
    padding: 0 18px;

    & .title {
        height: 100%;
        display: flex;
        align-items: center;

        p {
            font-family: 'ptmono';
            color: #E5E5E5;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        img {
            width: 18px;
            height: 18px;
            margin-right: 18px;
        }
    }

    & .difficulty {
        height: 100%;
        display: flex;
        align-items: center;
    }
}

.buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 5px;

    button {
        background-color: #76bbca;
        border-radius: 6px;
        border: 1px solid #E5E5E5;
        color: #fff;
        font-size: 16px;
        font-family: 'pressstart2p';
        cursor: pointer;
        padding: 3px;
    }
}
</style>