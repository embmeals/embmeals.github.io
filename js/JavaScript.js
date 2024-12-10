body {
    scrollbar - width: none;
    -ms - overflow - style: none;
}

body:: -webkit - scrollbar {
    display: none;
}

html, p {
    font - size: 1.25rem;
    font - weight: 600;
    line - height: 1.4;
    letter - spacing: -0.01em;
    font - family: Poppins, -apple - system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans - serif;
}

.dark - theme {
    background - color: rgb(17, 34, 64);
    color: #fafafa;
}

.tokyo_tm_home.avatar {
    min - width: 300px;
    min - height: 300px;
    position: relative;
    border - radius: 100 %;
}

    .tokyo_tm_home.avatar.image {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background - repeat: no - repeat;
    background - position: center;
    background - size: cover;
    animation: morph 8s ease -in -out infinite 1s;
    background - blend - mode: multiply;
    -webkit - box - shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, .3);
    -moz - box - shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, .3);
    box - shadow: inset 0px 0px 0px 9px rgba(255, 255, 255, .3);
}

@keyframes morph {
    0 % {
        border- radius: 60 % 40 % 30 % 70 % / 60% 30% 70% 40%;
}

50 % {
    border- radius: 30 % 60 % 70 % 40 % / 50% 60% 30% 60%;
}

100 % {
    border- radius: 60 % 40 % 30 % 70 % / 60% 30% 70% 40%;
}
}


.light - theme {
    background - color: rgb(142, 177, 154);
    color: rgb(17, 34, 64);
}

  
  .image - container img {
    animation: float 4s ease -in -out infinite;
}

@media(min - width: 768px) {
    html {
        font - size: 16px;
    }
}

img {
    width: 450px;
    border - radius: 50 %;
}

.icon - light, .icon - dark {
    position: absolute;
    top: 50 %;
    background - repeat: no - repeat;
    background - size: cover;
    transform: translateY(-50 %);
}

.icon - light {
    left: 10 %;
    width: 20px;
    height: 20px;
    background - image: url('images/sunny.png');
}

.icon - dark {
    right: 10 %;
    width: 25px;
    height: 30px;
    background - image: url('images/noun-moon-2269754-ffb258.svg');
}

@media(max - width: 767px) {
    .image - container img {
        width: 100 %;
        height: auto;
    }
}

.switch {
    position: relative;
    display: inline - block;
    width: 60px;
    height: 34px;
}

    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: white;
    background - color: #4169e1;
    -webkit - transition: .4s;
    transition: .4s;
}

    .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background - color: #fef9f3;
    -webkit - transition: .4s;
    transition: .4s;
}

input: checked + .slider {
    color: black;
    background - color: #3f7cac;
}

input: checked + .slider:before {
    -webkit - transform: translateX(26px);
    -ms - transform: translateX(26px);
    transform: translateX(26px);
}

.slider.round {
    border - radius: 34px;
}

    .slider.round:before {
    border - radius: 50 %;
}

@keyframes moveUpDown {
    0 %, 100 % {
        top: 0;
    }

    50 % {
        top: 100px;
    }
}

html {
    position: relative;
    min - height: 100 %;
}