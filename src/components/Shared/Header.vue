<template>
    <div class="header-container">
        <p class="logo">Siemens' Submission</p>
        <p class="title">{{ title }} <span class="wave-sign">{{ emoji }}</span></p>
        <p class="subtitle">{{ subtitle }}</p>
    </div>
</template>
<script>
export default {
    name: "header",
    props: {
        title: {
            type: String,
            required: true,
        },
        emoji: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
        }
    }
}
</script>
<style lang="scss" scoped>
.header-container {
    width: 100%;
    height: 150px;
    background-color: #162041;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 20px;

    p {
        padding: 0;
        margin: 0;
    }

    & .logo {
        font-family: 'pressstart2p';
        color: #f4ee80;
        text-shadow: 1px 2px #a14759;
        font-size: 14px;
    }

    & .title {
        font-family: 'pressstart2p';
        font-size: 18px;
    }

    & .subtitle {
        font-family: 'ptmono';
    }

    & .wave-sign {
        font-size: 32px;
    }

}
</style>