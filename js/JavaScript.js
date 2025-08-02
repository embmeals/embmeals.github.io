const styles = `
body {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
body::-webkit-scrollbar {
    display: none;
}
html, p {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.01em;
    font-family: Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.dark-theme {
    background-color: rgb(17, 34, 64);
    color: #fafafa;
}
.tokyo_tm_home.avatar {
    min-width: 300px;
    min-height: 300px;
    position: relative;
    border-radius: 100%;
}
.tokyo_tm_home.avatar.image {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    animation: morph 8s ease-in-out infinite 1s;
    background-blend-mode: multiply;
    -webkit-box-shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, 0.3);
    -moz-box-shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, 0.3);
    box-shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, 0.3);
}
@keyframes morph {
    0% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
    50% {
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    }
    100% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }
}
`;