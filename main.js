//canvas
var canvas = document.getElementById('canvas')

canvas.width = 1280
canvas.height = 720

var ctx = canvas.getContext('2d')


//variables
var interval
var frames = 0
var platforms = []
var coins = []
var obstacles = []
var portals = []
var score = 0
var pressedBtn
var images = {
    world1: {
        bg: './assets/World_1/Background.png',
        character: {
            run: ['./assets/World_1/run1.png', './assets/World_1/run2.png', './assets/World_1/run3.png', './assets/World_1/run1.png',]
        },
        pads: ['./assets/World_1/Pad1.png', './assets/World_1/Pad2.png'],
        coin: './assets/World_1/Coin1.png',
        obstacle: './assets/World_1/obstacle2.png',
    },
    world2: {
        bg: './assets/World_2/Background3.jpg',
        character: {
            run: ['./assets/World_3/run1.png', './assets/World_3/run2.png', './assets/World_3/run3.png', './assets/World_3/run4.png']
        },
        pads: ['./assets/World_2/Pad1.png', './assets/World_2/Pad2.png'],
        coin: './assets/World_2/coin1.png',
        obstacle: './assets/World_2/obstacle1.png',
    },
    world3: {
        bg: './assets/World_3/Background.png',
        character: {
            run: ['./assets/World_2/run1.png', './assets/World_2/run2.png', './assets/World_2/run3.png', './assets/World_2/run4.png']
        },
        pads: ['./assets/World_3/Pad1.png', './assets/World_3/Pad2.png'],
        coin: './assets/World_3/coin1.png',
        obstacle: './assets/World_3/obstacle1.png'
    },
    welcomeSc: './assets/Main.jpg',
    bat: './assets/World_3/bat1.png',
    portals: ['./assets/Portals/GreenPortal.png', './assets/Portals/PurplePortal.png'],
    keyA: '',
    keyS: '',
}

//clases
function Board(bgImage) {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.image = new Image()
    this.image.src = bgImage
    this.image.onload = () => this.draw()
    this.draw = () => {
        this.x--
        if (this.x < -this.width) this.x = 0
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}

function Character(x, y, width, height, images) {
    this.x = x
    this.y = y
    this.width = width || 200
    this.height = height || 200
    this.jumping = true
    this.position = 0
    this.frame1 = new Image()
    this.frame1.src = images[0]
    this.frame2 = new Image()
    this.frame2.src = images[1]
    this.frame3 = new Image()
    this.frame3.src = images[2]
    this.frame4 = new Image()
    this.frame4.src = images[3]
    this.y_velocity = 2.5
    this.grounded = false
    this.fps = [this.frame1, this.frame2, this.frame3, this.frame4]
    this.draw = () => {
        this.boundaries()
        ctx.drawImage(this.fps[this.position], this.x, this.y, this.width, this.height)

        if (frames % 10 === 0) {
            switch (this.position) {
                case this.fps.length - 1:
                    this.position = 0
                default:
                    this.position += 1
            }
        }
    }
    this.boundaries = function () {
        if (this.y + this.height > canvas.height - 95) {
            this.y = canvas.height - this.height - 100
            this.y_velocity = 0
            this.jumping = false
        }
        else this.y += this.y_velocity

    }
    this.isTouching = (item) => {
        return (this.x < item.x + item.width / 10) &&
            (this.x + this.width > item.x + this.height / 10) &&
            (this.y < item.y + item.height / 10) &&
            (this.y + this.height > item.y + this.width / 10)
    }
}

function Platform(y, width, image) {
    this.x = canvas.width
    this.y = y
    this.width = width || 200
    this.height = 50
    this.platform = new Image()
    this.platform.src = image[0]
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.platform, this.x, this.y, this.width, this.height)
    }
}

function Coin(y, image) {
    this.x = canvas.width
    this.y = y || 425
    this.width = 70
    this.height = 70
    this.coin = new Image()
    this.coin.src = image
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.coin, this.x, this.y, this.width, this.height)
    }
}

function Obstacle(image) {
    this.x = canvas.width
    this.y = 555
    this.width = 100
    this.height = 70
    this.obstacle = new Image()
    this.obstacle.src = image
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.obstacle, this.x, this.y, this.width, this.height)
    }
}

function Obstacle2(y, width, image) {
    this.x = canvas.width
    this.y = y || 550
    this.width = width || 100
    this.height = 45
    this.obstacle = new Image()
    this.obstacle.src = image
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.obstacle, this.x, this.y, this.width, this.height)
    }
}

function Portal(y, image, type) {
    this.x = canvas.width
    this.y = y
    this.width = 100
    this.height = 100
    this.portal = new Image()
    this.portal.src = image
    this.type = type
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.portal, this.x, this.y, this.width, this.height)
    }
}

//instances
var button = new Image()


//world1
var bg = new Board(images.welcomeSc)
var world1 = new Board(images.world1.bg)
var player1 = new Character(50, 425, 100, 100, images.world1.character.run)
//world2
var world2 = new Board(images.world2.bg)
var player2 = new Character(50, 425, 120, 120, images.world2.character.run)
//world3
var world3 = new Board(images.world3.bg)
var player3 = new Character(50, 425, 120, 120, images.world3.character.run)
//

var bgMusic = new Audio()
bgMusic.src = "./assets/Waves.mp3"
var youlose = new Audio()
youlose.src = "./assets/SAD.mp3"

//main functions
function start() {
    score = 0
    if (bgMusic.paused) {
        bgMusic.play()
        youlose.pause();
        youlose.currentTime = 0;
    }
    frames = 0
    if (!interval) interval = setInterval(update, 500 / 60)

}
var currentPlayer = 3
var world = 3

function update() {
    frames++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    switch (world) {
        case 3:
            currentPlayer = player3
            world3.draw()
            player3.draw()
            drawPlatforms(images.world3.pads)
            drawCoins(images.world3.coin)
            drawObstacles(images.world3.obstacle)
            drawPortals()
            checkCoinCollition()
            checkPlatformCollition()
            checkObstacleCollition()
            checkPortalCollition()
            drawScore()
            ctx.drawImage(button, 100, 650, 100, 50)
            break;

        case 2:
            currentPlayer = player2
            world2.draw()
            player2.draw()
            drawPlatforms(images.world2.pads)
            drawCoins(images.world2.coin)
            drawObstacles(images.world2.obstacle)
            drawPortals()
            checkCoinCollition()
            checkPlatformCollition()
            checkObstacleCollition()
            checkPortalCollition()
            drawScore()
            ctx.drawImage(button, 100, 650, 100, 50)
            break;

        case 1:
            currentPlayer = player1
            world1.draw()
            player1.draw()
            drawPlatforms(images.world1.pads)
            drawCoins(images.world1.coin)
            drawObstacles(images.world1.obstacle)
            drawPortals()
            checkCoinCollition()
            checkPlatformCollition()
            checkObstacleCollition()
            checkPortalCollition()
            drawScore()
            ctx.drawImage(button, 100, 650, 100, 50)
            break;
        default:
            break;
    }

}

function gameOver() {
    clearInterval(interval)
    interval = null
    platforms = []
    coins = []
    obstacles = []
    portals = []
    pressedBtn = ""
    bgMusic.pause()
    bgMusic.currentTime = 0;
    youlose.play()
    ctx.font = "bold 80px Arial"
    ctx.fillText("GAME OVER", 300, 200)
    ctx.fillStyle = "black"
    ctx.font = "bold 40px Arial"
    ctx.fillText("Score: " + score, 300, 280)
    ctx.font = "bold 20px Arial"
    ctx.fillText("Presiona 'Return' para reiniciar", 300, 350)
    ctx.fillStyle = "brown"

}


//aux functions

function generatePlatforms(images) {
    if (frames % 250 === 0) {
        if (platforms.length >= 5) platforms.shift()
        var width = Math.floor(Math.random() * 400 + 50)
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        platforms.push(new Platform(y, width, images))
    }
}

function generateCoins(images) {
    if (frames % 600 === 0) {
        if (coins.length >= 5) coins.shift()
        var y = Math.floor(Math.random() * (550 - 200 + 1)) + 200;
        coins.push(new Coin(y, images))
    }
}

function generateObstacles(image) {
    if (frames % 370 === 0) {
        if (obstacles.length >= 5) obstacles.shift()
        obstacles.push(new Obstacle(image))
    }

    if (frames % 270 === 0) {
        if (obstacles.length >= 5) obstacles.shift()
        var width = 45
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        obstacles.push(new Obstacle2(y, width, images.bat))
    }
}

function generatePlatforms(images) {
    if (frames % 250 === 0) {
        if (platforms.length >= 5) platforms.shift()
        var width = Math.floor(Math.random() * 400 + 100)
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        platforms.push(new Platform(y, width, images))
    }
}

function generatePortals() {
    if (frames % 1000 === 0) {
        if (portals.length >= 2) portals.shift()
        var pos = Math.round(Math.random())
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        var type
        if (pos === 0) type = 'verde'
        else type = 'morado'

        portals.push(new Portal(y, images.portals[pos], type))

    }
}

function drawPortals() {
    generatePortals()
    portals.forEach(function (portal) {
        portal.draw()
    })
}
function drawPlatforms(images) {
    generatePlatforms(images)
    platforms.forEach(function (platform) {
        platform.draw()
    })
}

function drawCoins(images) {
    generateCoins(images)
    coins.forEach(function (coin) {
        coin.draw()
    })
}

function drawObstacles(images) {
    generateObstacles(images)
    obstacles.forEach(function (obstacle) {
        obstacle.draw()
    })
}

function collisionCheck(char, plat) {
    var vectorX = (char.x + (char.width / 2)) - (plat.x + (plat.width / 2));
    var vectorY = (char.y + (char.height / 2)) - (plat.y + (plat.height / 2));


    var halfWidths = (char.width / 2) + (plat.width / 2) - 50;
    var halfHeights = (char.height / 2) + (plat.height / 2) - 5;

    var collisionDirection = null;

    if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
        var offsetX = halfWidths - Math.abs(vectorX);
        var offsetY = halfHeights - Math.abs(vectorY);
        if (offsetX < offsetY) {
            if (vectorX > 0) {
                collisionDirection = "left";
                char.x = char.x;

            } else {
                collisionDirection = "right";
                char.x = char.x;
            }
        } else {
            if (vectorY > 0) {
                collisionDirection = "top";
            } else {
                collisionDirection = "bottom";
                char.y -= offsetY;
            }
        }
    }
    return collisionDirection;
}

function checkCoinCollition() {
    for (var coin of coins) {
        if (currentPlayer.isTouching(coin)) {
            score += 10
            coins.splice(coins.indexOf(coin), 1)
        }
    }
}

function drawScore() {
    ctx.font = "30px Arial"
    ctx.fillStyle = "White"
    if (Math.floor(frames % 60 === 0)) {
        score = score + 1
    }
    ctx.fillText("Score: " + score, 100, 100)
}

function checkObstacleCollition() {
    for (var obstacle of obstacles) {
        if (currentPlayer.isTouching(obstacle)) {
            gameOver()
        }
    }
}

function checkPortalCollition() {
    for (var portal of portals) {
        if (currentPlayer.isTouching(portal)) {
            if (portal.type === pressedBtn) {
                var worldsLeft = []
                console.log(world)
                switch (world) {
                    case 1:
                        worldsLeft = [2, 3]
                        var pos = Math.round(Math.random())
                        console.log('new world' + pos)
                        world = worldsLeft[pos]
                        score += 50
                        break;

                    case 2:
                        worldsLeft = [1, 3]
                        var pos = Math.round(Math.random())
                        console.log('new world' + pos)
                        world = worldsLeft[pos]
                        score += 50
                        break;
                    case 3:
                        worldsLeft = [1, 2]
                        var pos = Math.round(Math.random())
                        console.log('new world' + pos)
                        world = worldsLeft[pos]
                        score += 50
                        break;
                    default:
                        break;
                }
                coins = []
                obstacles = []
            }
            else {
                gameOver()

            }
        }
    }
}

function checkPlatformCollition() {
    platforms.forEach(platform => {
        var direction = collisionCheck(currentPlayer, platform);
        if (direction == "left" || direction == "right") {
        } else if (direction == "bottom") {
            currentPlayer.jumping = false

        } else if (direction == "top") {
        }
    });
}

function drawCover() {
    var img = new Image()
    img.src = images.welcomeSc
    img.onload = () => {
        bg.draw()
    }
}


//listeners
addEventListener('keyup', function (e) {
    switch (e.keyCode) {
        case 13:
            return start()
        case 32:
            currentPlayer.y_velocity = 2.5
            return
        case 65:
            button.src = './assets/Keys/A-Key.png'
            pressedBtn = 'verde'
            return
        case 83:
            button.src = './assets/Keys/S-Key.png'
            pressedBtn = 'morado'
            return
        default:
            return
    }
})

addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 32:
            if (!currentPlayer.jumping) {
                currentPlayer.y_velocity -= 7
                currentPlayer.jumping = true
            }

            return
        default:
            return
    }
})

drawCover()
