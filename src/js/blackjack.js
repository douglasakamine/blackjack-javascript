class Game {
    
    constructor() {
        this.deck = ['2C','2D','2H','2C',
                     '3C','3D','3H','3C',
                     '4C','4D','4H','4C',
                     '5C','5D','5H','5C',
                     '6C','6D','6H','6C',
                     '7C','7D','7H','7C',
                     '8C','8D','8H','8C',
                     '9C','9D','9H','9C',
                     'AC','AD','AH','AC',
                     'JC','JD','JH','JC',
                     'KC','KD','KH','KC',
                     'QC','QD','QH','QC']
        this.removedCards = []
        this.dealerCount = 0
        this.playerCount = 0
        this.playerHand = []
        this.dealerHand = []
        this.dealerFlipCard = false
        this.bet = 0
        this.balance = 1000
        this.placeYourBetBox = document.getElementById('place-your-bet')
        this.gameOverBox = document.getElementById('game-over')
        this.balanceDisplay = document.getElementById('balance')
        this.balanceDisplay.innerHTML = "$" + this.balance
        this.betValueDisplay = document.getElementById('bet-value')
        this.message = document.getElementById('message')
        this.buttons = document.getElementById('buttons')
        this.dealerCountDisplay = document.getElementById('dealer-count')
        this.playerCountDisplay = document.getElementById('player-count')
        this.playerCards = document.getElementById('player-cards')
        this.dealerCards = document.getElementById('dealer-cards')
        this.cardBack = document.getElementById('card-back')
        this.betButtons = document.querySelectorAll('button[class="deal-button"]')
        this.betButtons.forEach(el => el.addEventListener('click', event => {
            this.placeBet(event.target)
        }))
        this.dealButton = document.getElementById('bet').addEventListener('click', () => {
            if (parseInt(this.betValueDisplay.innerHTML.substring(1)) > 0) {
                this.makeADeal()
            } 
        })
        this.resetBet = document.getElementById('reset').addEventListener('click', () => {
            this.betValueDisplay.innerHTML = "$0"
            this.balanceDisplay.innerHTML = "$" + this.balance
            this.checkBalanceAndDisableButtons(this.betButtons, 
                parseInt(this.balanceDisplay.innerHTML.substring(1)))
        })
        this.restartGame = document.getElementById('restart-game').addEventListener('click', () => {
            this.resetVariables()
            this.balance = 1000
            this.balanceDisplay.innerHTML = "$" + this.balance
            this.gameOverBox.style.display = "none"
            this.start()
        })
        this.buttonHit = document.getElementById('hit').addEventListener('click', () => {
            this.playerNewCard()
        })
        this.buttonStand = document.getElementById('stand').addEventListener('click', () => {
            this.toggleHitButton(true)
            this.dealerGame()
        })
        this.cardsSection = document.getElementById('cards-section')
        this.start()
    }

    start() {
        this.placeYourBetBox.style.display = "inline"
        this.checkBalanceAndDisableButtons(this.betButtons, 
            parseInt(this.balanceDisplay.innerHTML.substring(1)))
    }

    checkBalanceAndDisableButtons(betButtons, balance) {
        betButtons.forEach(el => {
            if (parseInt(el.dataset.value) > balance) {
                el.disabled = true
            } else {
                el.disabled = false
            }
        })
    }   

    makeADeal() {
        this.bet = parseInt(this.betValueDisplay.innerHTML.substring(1))
        this.betValueDisplay.innerHTML = "$0"
        this.placeYourBetBox.style.display = "none"
        this.cardsSection.style.display = "block"
        this.buttons.style.display = "inline"
        this.buttons.children[2].children[0].innerHTML = "$" + this.bet
        this.toggleHitButton(false)
        this.gameFirstFlip()
    }

    placeBet(eventButton) {
        let bet = parseInt(eventButton.dataset.value)
        let totalBet = parseInt(this.betValueDisplay.innerHTML.substring(1))
        let balanceDisplay = parseInt(this.balanceDisplay.innerHTML.substring(1))
        totalBet = totalBet + bet
        balanceDisplay = balanceDisplay - bet
        this.betValueDisplay.innerHTML = "$" + totalBet
        this.balanceDisplay.innerHTML = "$" + balanceDisplay
        this.checkBalanceAndDisableButtons(this.betButtons, balanceDisplay)
    }

    gameFirstFlip() {
        this.cardBack.style.display = "inline"
        this.dealerNewCard()
        this.dealerFlipCard = true
        for(let i = 0; i < 2; i++) {
            this.playerNewCard()
        }  
    }
    
    dealerGame() {
        let interval = setInterval(() => {
            if (this.dealerCount >= 17 || this.dealerCount > this.playerCount) {
                clearInterval(interval)
                if(this.dealerCount > 21 || this.playerCount > this.dealerCount) {
                    this.endingTheTurn('player')
                } else if (this.playerCount == this.dealerCount) {
                    this.endingTheTurn('push')
                } else {
                    this.endingTheTurn('dealer')
                }
            } else {
                this.dealerNewCard()
            }
        }, 1500)
    }
    
    dealerNewCard() {
        let card = this.getRandomCard()
        if (this.dealerFlipCard) {
            this.cardBack.style.display = "none"
        } 
        this.dealerCards.appendChild(card)
        let newValue = this.sumCards(this.dealerCount, card, this.dealerHand)
        this.dealerCount = newValue
        this.dealerCountDisplay.innerHTML = newValue
    }

    playerNewCard() {
        let card = this.getRandomCard()
        this.playerCards.appendChild(card)
        let newValue = this.sumCards(this.playerCount, card, this.playerHand)
        this.playerCount = newValue
        this.playerCountDisplay.innerHTML = newValue
        if(newValue > 21) {
            this.toggleHitButton(true)
            this.message.style.display = "inline-block"
            this.endingTheTurn('dealer')
        } else if (newValue == 21) {
            this.toggleHitButton(true)
            this.dealerGame()
        }
    }

    getRandomCard() {
        let randomNumber = null
        do {
            randomNumber = Math.floor(Math.random() * this.deck.length)
        } while (this.removedCards.includes(randomNumber))
        this.removedCards.push(randomNumber)
        let cardImg = document.createElement("IMG")
        cardImg.setAttribute("src","src/img/" + this.deck[randomNumber] + ".png")
        cardImg.setAttribute("class","card-img")
        return cardImg
    }

    sumCards(count, cardElement, hand) {
        let cardValue = cardElement.getAttribute('src').substring(8,9)
        let faceCards = ["J","Q","K"]
        for(let i = 0; i <= faceCards.length; i++) {
            if(cardValue == faceCards[i]) {
                cardValue = 10
            }
        }
        if(cardValue == "A") {
            if(count <= 10) {
                cardValue = 11
            } else {
                cardValue = 1
            }
        }
        cardValue = parseInt(cardValue)
        hand.push(cardValue)
        let sum = 0
        hand.forEach(element => {
            sum = sum + element
        })
        if (sum > 21) {
            if (hand.includes(11)) {
                sum = sum - 10
            }
        }
        return sum
    }

    toggleHitButton(bool) {
        this.buttons.children[1].disabled = bool
        this.buttons.children[3].disabled = bool
    }

    endingTheTurn(whoWins) {
        this.message.style.display = "inline-block"
        this.buttons.style.display = "none"
        switch(whoWins) {
            case 'player':
            this.balance = this.balance + this.bet
            this.balanceDisplay.innerHTML = "$" + this.balance
            this.message.children[0].innerHTML = "You Win!"
            break
            case 'push': 
            this.balanceDisplay.innerHTML = "$" + this.balance
            this.message.children[0].innerHTML = "Push"
            break
            case 'dealer':
            this.balance = this.balance - this.bet
            this.balanceDisplay.innerHTML = "$" + this.balance 
            this.message.children[0].innerHTML = "Dealer Wins"
        }
        setTimeout(() => {
            while(this.playerCards.children.length > 1) {
                this.playerCards.removeChild(this.playerCards.lastChild)
            }
            while(this.dealerCards.children.length > 2) {
                this.dealerCards.removeChild(this.dealerCards.lastChild)
            }   
            this.resetVariables()
            this.message.style.display = "none"
            this.cardsSection.style.display = "none"
            if (this.balance <= 0) {
                this.gameOverBox.style.display = "inline"
            } else {
                this.start()
            }
        },5000)
    }

    resetVariables() {
        this.removedCards = []
        this.dealerCount = 0
        this.playerCount = 0
        this.playerHand = []
        this.dealerHand = []
        this.dealerFlipCard = false
        this.bet = 0
    }
}

let blackjack = new Game()