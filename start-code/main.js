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
var images = {
    world1: {
        bg: './assets/World_1/Background.png'
    },
    world2: {
        bg: './assets/World_2/Background.png',
        character: {
            run: ['./assets/World_3/run1.png', './assets/World_3/run2.png', './assets/World_3/run3.png', './assets/World_3/run4.png', './assets/World_3/run5.png', './assets/World_3/run6.png', './assets/World_3/run7.png', './assets/World_3/run8.png',]
        },
        pads: ['./assets/World_2/Pad1.png', './assets/World_2/Pad2.png'],
        coin: './assets/World_2/coin1.png',
    },
    world3: {
        bg: './assets/World_3/Background.png',
        character: {
            run: ['./assets/World_2/run1.png', './assets/World_2/run2.png', './assets/World_2/run3.png', './assets/World_2/run4.png', './assets/World_2/run5.png', './assets/World_2/run6.png']
        },
        pads: ['./assets/World_3/Pad1.png', './assets/World_3/Pad2.png'],
        coin: './assets/World_3/coin1.png',
        obstacle: './assets/World_3/obstacle1.png'
    },
    bat: './assets/World_3/bat1.png',
    portals: ['./assets/Portals/GreenPortal.png', './assets/Portals/PurplePortal.png']
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
    this.x = x || 50
    this.y = y || 425
    this.width = width || 200
    this.height = height || 200
    this.jumping = true
    this.position = 0
    this.character = new Image()
    this.character.src = images[this.position]
    this.y_velocity = 2.5
    this.grounded = false
    this.draw = () => {
        this.boundaries()
        ctx.drawImage(this.character, this.x, this.y, this.width, this.height)

        if (frames % 10 === 0) {
            switch (this.position) {
                case images.length - 1:
                    this.position = 0
                default:
                    this.position += 1
                    this.character.src = images[this.position]
            }
        }
    }
    this.boundaries = function () {
        if (this.y + this.height > canvas.height - 95) {
            this.y = canvas.height - this.height - 95
            this.y_velocity = 0
            this.jumping = false
        }
        else this.y += this.y_velocity

    }
    this.isTouching = (item) => {
        return (this.x < item.x + item.width / 3) &&
            (this.x + this.width > item.x + this.height / 3) &&
            (this.y < item.y + item.height / 3) &&
            (this.y + this.height > item.y + this.width / 3);
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

function Portal(y, image) {
    this.x = canvas.width
    this.y = y || 550
    this.width = 100
    this.height = 100
    this.portal = new Image()
    this.portal.src = image
    this.draw = () => {
        this.x -= 2
        ctx.drawImage(this.portal, this.x, this.y, this.width, this.height)
    }
}

//instances
//world1
var world1 = new Board(images.world1.bg)
//world2
var world2 = new Board(images.world2.bg)
var player2 = new Character(50, 425, 200, 200, images.world2.character.run)
//world3
var world3 = new Board(images.world3.bg)
var player3 = new Character(50, 425, 120, 120, images.world3.character.run)
//
var portal = new Portal(450, images.portals[0])


//main functions
function start() {
    frames = 0
    if (!interval) interval = setInterval(update, 300 / 60)

}
var currentPlayer
currentPlayer = player3

function update() {
    frames++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    world3.draw()
    currentPlayer.draw()
    // portal.draw()
    drawPlatforms(images.world3.pads)
    drawCoins(images.world3.coin)
    drawObstacles(images.world3.obstacle)
    drawPortals()
    checkCoinCollition()
    checkPlatformCollition()
    checkObstacleCollition()
    drawScore()
}

function gameOver() {
    clearInterval(interval)
    interval = null
    platforms = []
    coins = []
    obstacles = []
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
        var width = Math.floor(Math.random() * 400 + 50)
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        platforms.push(new Platform(y, width, images))
    }
}

function generatePortals() {
    if (frames % 2000 === 0) {
        if (portals.length >= 2) portals.shift()
        var pos = Math.round(Math.random())
        var y = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
        portals.push(new Portal(y, images.portals[pos]))

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
    var vectorX = (char.x + (char.width / 2)) - (plat.x + (plat.width / 2)) + 50;
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
            coins.splice(coins.indexOf(coin), 1)
        }
    }
}

function drawScore() {
    ctx.font = "bold 24px 'Press Start 2P'"
    ctx.fillText("Score: " + Math.floor(frames / 60), 50, 50)
}

function checkObstacleCollition() {
    for (var obstacle of obstacles) {
        if (currentPlayer.isTouching(obstacle)) {
            gameOver()
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

//listeners
addEventListener('keyup', function (e) {
    switch (e.keyCode) {
        case 13:
            return start()
        case 32:
            currentPlayer.y_velocity = 2.5
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
