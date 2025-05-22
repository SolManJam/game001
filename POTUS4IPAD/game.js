
        const presidents = [
            { name: "Washington", suit: "other", rank: 1, term: "1789-1797", number: "First President" },
            { name: "J. Adams", suit: "other", rank: 2, term: "1797-1801", number: "Second President" },
            { name: "Jefferson", suit: "democratic", rank: 3, term: "1801-1809", number: "Third President" },
            { name: "Madison", suit: "democratic", rank: 4, term: "1809-1817", number: "Fourth President" },
            { name: "Monroe", suit: "democratic", rank: 5, term: "1817-1825", number: "Fifth President" },
            { name: "J.Q. Adams", suit: "other", rank: 6, term: "1825-1829", number: "Sixth President" },
            { name: "Jackson", suit: "democratic", rank: 7, term: "1829-1837", number: "Seventh President" },
            { name: "Van Buren", suit: "democratic", rank: 8, term: "1837-1841", number: "Eighth President" },
            { name: "W.H. Harrison", suit: "other", rank: 9, term: "1841", number: "Ninth President" },
            { name: "Tyler", suit: "other", rank: 10, term: "1841-1845", number: "Tenth President" },
            { name: "Polk", suit: "democratic", rank: 11, term: "1845-1849", number: "Eleventh President" },
            { name: "Taylor", suit: "other", rank: 12, term: "1849-1850", number: "Twelfth President" },
            { name: "Fillmore", suit: "other", rank: 13, term: "1850-1853", number: "Thirteenth President" },
            { name: "Pierce", suit: "democratic", rank: 14, term: "1853-1857", number: "Fourteenth President" },
            { name: "Buchanan", suit: "democratic", rank: 15, term: "1857-1861", number: "Fifteenth President" },
            { name: "Lincoln", suit: "republican", rank: 16, term: "1861-1865", number: "Sixteenth President" },
            { name: "Johnson", suit: "democratic", rank: 17, term: "1865-1869", number: "Seventeenth President" },
            { name: "Grant", suit: "republican", rank: 18, term: "1869-1877", number: "Eighteenth President" },
            { name: "Hayes", suit: "republican", rank: 19, term: "1877-1881", number: "Nineteenth President" },
            { name: "Garfield", suit: "republican", rank: 20, term: "1881", number: "Twentieth President" },
            { name: "Arthur", suit: "republican", rank: 21, term: "1881-1885", number: "Twenty-first President" },
            { name: "Cleveland", suit: "democratic", rank: 22, term: "1885-1889, 1893-1897", number: "Twenty-second and Twenty-fourth President" },
            { name: "B. Harrison", suit: "republican", rank: 23, term: "1889-1893", number: "Twenty-third President" },
            { name: "McKinley", suit: "republican", rank: 24, term: "1897-1901", number: "Twenty-fifth President" },
            { name: "T. Roosevelt", suit: "republican", rank: 25, term: "1901-1909", number: "Twenty-sixth President" },
            { name: "Taft", suit: "republican", rank: 26, term: "1909-1913", number: "Twenty-seventh President" },
            { name: "Wilson", suit: "democratic", rank: 27, term: "1913-1921", number: "Twenty-eighth President" },
            { name: "Harding", suit: "republican", rank: 28, term: "1921-1923", number: "Twenty-ninth President" },
            { name: "Coolidge", suit: "republican", rank: 29, term: "1923-1929", number: "Thirtieth President" },
            { name: "Hoover", suit: "republican", rank: 30, term: "1929-1933", number: "Thirty-first President" },
            { name: "FDR", suit: "democratic", rank: 31, term: "1933-1945", number: "Thirty-second President" }
        ];

        const foundationSequences = {
            republican: [30, 29, 28, 26, 25, 24, 23, 21, 20, 19, 18, 16],
            democratic: [31, 27, 22, 17, 15, 14, 11, 8, 7, 5, 4, 3],
            other: [13, 12, 10, 9, 6, 2, 1]
        };

        const suitAbbrev = {
            'democratic': 'D',
            'republican': 'R',
            'other': 'O'
        };

        const suitColors = {
            'republican': '#FF6666',
            'democratic': '#6666FF',
            'other': '#d4a017'
        };

        let stock = [];
        let waste = [];
        let tableau = [[], [], []];
        let foundations = { republican: [], democratic: [], other: [] };
        let gameInProgress = false;
        let startTime = 0;
        let timerInterval = null;
        let stockReshuffles = 0;
        let gameStarted = false;
        let initialCards = [];
        let selectedCard = null;
        let dragGhost = null;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function getOrdinal(n) {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        }

        function initGame() {
            stock = shuffle([...presidents]);
            tableau = [[], [], []];
            foundations = { republican: [], democratic: [], other: [] };
            waste = [];
            stockReshuffles = 0;
            document.getElementById('stock-counter').textContent = 'Reshuffles: 0';
            startTime = Date.now();
            gameInProgress = true;
            gameStarted = false;
            initialCards = [];
            selectedCard = null;
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);
            document.getElementById('new-game-button').style.display = 'none';
            document.getElementById('high-score-screen').style.display = 'none';
            renderGame();
            renderCheatSheet();
            displayInitialCards();
        }

        function updateTimer() {
            if (gameInProgress) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                document.getElementById('timer').textContent = `Time: ${elapsed}s`;
            }
        }

        function renderCheatSheet() {
            const suits = ['republican', 'democratic', 'other'];
            suits.forEach(suit => {
                const cheatId = `cheat-${suit[0]}`;
                const cheatElement = document.getElementById(cheatId);
                const sequence = foundationSequences[suit];
                const remaining = sequence.filter(rank => !foundations[suit].some(card => card.rank === rank));
                if (remaining.length === 0) {
                    cheatElement.innerHTML = `<p>Group Complete</p>`;
                } else {
                    const nextOne = remaining[0];
                    const president = presidents.find(p => p.rank === nextOne);
                    cheatElement.innerHTML = `<p>NEXT UP:</p><div class="president-entry" data-rank="${nextOne}"><p>${president.term}</p><p>${president.name}</p></div>`;
                }
            });
        }

        function displayInitialCards() {
            const firstCards = {
                republican: presidents.find(p => p.rank === 30),
                democratic: presidents.find(p => p.rank === 31),
                other: presidents.find(p => p.rank === 13)
            };

            const foundations = [
                { id: 'foundation-r', suit: 'republican', rank: 30, fadeClass: 'fade-out-r', delay: 0 },
                { id: 'foundation-d', suit: 'democratic', rank: 31, fadeClass: 'fade-out-d', delay: 4000 },
                { id: 'foundation-o', suit: 'other', rank: 13, fadeClass: 'fade-out-o', delay: 8000 }
            ];

            initialCards = [];
            foundations.forEach(f => {
                const card = firstCards[f.suit];
                const cardElement = createCardElement(card, false, false, false, false, true);
                cardElement.classList.add(f.fadeClass);
                cardElement.style.top = '70px';
                cardElement.style.left = '0';
                cardElement.style.zIndex = 100;
                document.getElementById(f.id).appendChild(cardElement);
                const timeout = setTimeout(() => {
                    if (!gameStarted) {
                        cardElement.remove();
                        const entry = document.querySelector(`#cheat-${f.suit[0]} .president-entry[data-rank="${f.rank}"]`);
                        if (entry) {
                            entry.classList.add('pulsate');
                            setTimeout(() => entry.classList.remove('pulsate'), 3000);
                        }
                    }
                }, f.delay + 4000);
                initialCards.push({ element: cardElement, timeout: timeout });
            });
        }

        function getLastName(name) {
            const parts = name.split(' ');
            return parts[parts.length - 1].toUpperCase();
        }

        function getElectionYear(term) {
            const match = term.match(/\d{4}/);
            return match ? match[0] : '';
        }

        function saveScore(initials, time) {
            let scores = JSON.parse(localStorage.getItem('highScores') || '[]');
            scores.push({ initials, time });
            scores.sort((a, b) => a.time - b.time);
            scores = scores.slice(0, 10);
            localStorage.setItem('highScores', JSON.stringify(scores));
        }

        function showHighScores() {
            const scores = JSON.parse(localStorage.getItem('highScores') || '[]').filter(score => score.initials && score.time);
            const list = document.getElementById('high-score-list');
            list.innerHTML = '';
            scores.forEach(score => {
                const li = document.createElement('li');
                li.textContent = `${score.initials} - ${formatTime(score.time)}`;
                list.appendChild(li);
            });
            document.getElementById('high-score-screen').style.display = 'flex';
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
            return minutes > 0 ? `${minutes} minutes, ${formattedSeconds} seconds` : `${remainingSeconds} seconds`;
        }

        function getValidDestinations(card) {
            const destinations = [];
            for (let i = 0; i < 3; i++) {
                const pile = tableau[i];
                const lastCard = pile[pile.length - 1];
                if (pile.length === 0 || isValidTableauMove(card, lastCard)) {
                    destinations.push(`tableau-${i}`);
                }
            }
            ['republican', 'democratic', 'other'].forEach(suit => {
                const foundation = foundations[suit];
                const lastCard = foundation[foundation.length - 1];
                if (isValidFoundationMove(card, lastCard, suit)) {
                    destinations.push(`foundation-${suit[0]}`);
                }
            });
            return destinations;
        }

        function renderGame() {
            const stockDiv = document.getElementById('stock');
            stockDiv.innerHTML = '';
            if (stock.length > 0) {
                const stockImage = document.createElement('img');
                stockImage.src = 'CARDS/cardback.jpg';
                stockImage.className = 'stock-image';
                stockImage.title = 'Click to draw cards';
                stockImage.addEventListener('click', drawCards);
                stockDiv.appendChild(stockImage);
            } else if (waste.length > 0) {
                const reloadButton = document.createElement('button');
                reloadButton.textContent = 'Reload Deck';
                reloadButton.className = 'reload-button';
                reloadButton.addEventListener('click', reshuffleStock);
                stockDiv.appendChild(reloadButton);
            }

            document.getElementById('waste').innerHTML = '<div class="label">Waste</div>';
            const wasteDisplay = waste.slice(-3);
            wasteDisplay.forEach((card, index) => {
                const isTopCard = index === wasteDisplay.length - 1;
                const cardElement = createCardElement(card, isTopCard, false, false, false, false);
                cardElement.classList.add('waste-card');
                cardElement.style.top = `${40 * index}px`; /* Adjusted for larger size */
                cardElement.style.left = '0';
                cardElement.style.zIndex = index;
                document.getElementById('waste').appendChild(cardElement);
            });

            for (let i = 0; i < 3; i++) {
                document.getElementById(`tableau-${i}`).innerHTML = `<div class="label">Tableau ${i + 1}</div>`;
                let cumulativeTop = 0;
                const initialOffset = 30;
                const minOffset = 20;
                tableau[i].forEach((card, index) => {
                    const scale = 1 - (index * 0.005);
                    const offset = Math.max(minOffset, initialOffset - index);
                    const isTopCard = index === tableau[i].length - 1;
                    const addHover = index < tableau[i].length - 1;
                    const cardElement = createCardElement(card, isTopCard, false, true, addHover, false);
                    cardElement.style.top = `${cumulativeTop}px`;
                    cardElement.style.left = '0';
                    cardElement.style.zIndex = index;
                    cardElement.style.transform = `scale(${scale})`;
                    cardElement.style.transformOrigin = 'top left';
                    if (selectedCard && card.suit === selectedCard.card.suit && card.rank === selectedCard.card.rank) {
                        cardElement.classList.add('selected');
                    }
                    document.getElementById(`tableau-${i}`).appendChild(cardElement);
                    cumulativeTop += offset;
                });
            }

            ['republican', 'democratic', 'other'].forEach(suit => {
                const foundationId = `foundation-${suit[0]}`;
                document.getElementById(foundationId).innerHTML = `
                    <div class="label">${suit.charAt(0).toUpperCase() + suit.slice(1)}</div>
                    <div class="president-info" id="info-${suit[0]}"></div>
                    <div class="cheat-sheet" id="cheat-${suit[0]}"></div>
                `;
                let currentTop = 70;
                const initialOffset = 27;
                const decrement = 0.5;
                const minOffset = 15;
                foundations[suit].forEach((card, index) => {
                    const cardElement = createCardElement(card, false, false, false, false, false);
                    cardElement.style.top = `${currentTop}px`;
                    cardElement.style.left = '0';
                    cardElement.style.zIndex = index;
                    document.getElementById(foundationId).appendChild(cardElement);
                    const offset = Math.max(minOffset, initialOffset - index * decrement);
                    currentTop += offset;
                });
                const infoDiv = document.getElementById(`info-${suit[0]}`);
                if (foundations[suit].length > 0) {
                    const topCard = foundations[suit][foundations[suit].length - 1];
                    infoDiv.innerHTML = `
                        <div style="font-size:16px; color:#FFD700; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${topCard.name.toUpperCase()}
                        </div>
                        <div style="font-size:16px; color:#FFD700; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${topCard.term}
                        </div>
                        <div style="font-size:16px; color:#FFD700; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-family: 'Dancing Script', cursive;">
                            ${getOrdinal(topCard.rank)} President
                        </div>
                    `;
                } else {
                    infoDiv.innerHTML = `
                        <div style="font-size:16px; color:#FFD700; text-align:center;">
                            Drag cards here ⬇️
                        </div>
                    `;
                }
                const cheatSheet = document.getElementById(`cheat-${suit[0]}`);
                if (foundations[suit].length > 0) {
                    const lastCardTop = currentTop - Math.max(15, 27 - (foundations[suit].length - 1) * 0.5);
                    const lastCardBottom = lastCardTop + 186;
                    cheatSheet.style.top = `${lastCardBottom + 10}px`;
                } else {
                    cheatSheet.style.top = '70px';
                }
            });

            document.querySelectorAll('.pile, .foundation').forEach(el => el.classList.remove('destination-highlight'));
            if (selectedCard) {
                const validDestinations = getValidDestinations(selectedCard.card);
                validDestinations.forEach(id => {
                    document.getElementById(id).classList.add('destination-highlight');
                });
            }

            renderCheatSheet();
            checkWin();
        }

        function createCardElement(card, draggable, showTerm = false, isTableau = false, addHover = false, isTopCard = false) {
            const container = document.createElement('div');
            container.className = 'card-container';
            const div = document.createElement('div');
            div.className = `card ${card.suit}`;
            const abbrev = suitAbbrev[card.suit];
            const imgPath = `CARDS/${abbrev}-${card.rank}.jpg`;
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = `${card.name} (${abbrev}-${card.rank})`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.onerror = function() {
                this.style.display = 'none';
                const text = document.createElement('span');
                text.className = 'card-text';
                text.textContent = `${card.name} (${abbrev}-${card.rank})`;
                div.appendChild(text);
            };
            div.appendChild(img);
            container.appendChild(div);
            container.dataset.suit = card.suit;
            container.dataset.rank = card.rank;
            container.dataset.name = card.name;

            if (isTableau && addHover) {
                const hoverDiv = document.createElement('div');
                hoverDiv.className = 'card-hover';
                hoverDiv.style.color = suitColors[card.suit];
                hoverDiv.innerHTML = `${getLastName(card.name)} ${getElectionYear(card.term)}`;
                container.appendChild(hoverDiv);
            }

            if (draggable) {
                container.draggable = true;
                container.addEventListener('dragstart', dragStart);
                container.addEventListener('touchstart', touchStart, { passive: false });
                container.addEventListener('touchmove', touchMove, { passive: false });
                container.addEventListener('touchend', touchEnd);
            }

            return container;
        }

        function selectCard(container) {
            const card = {
                suit: container.dataset.suit,
                rank: parseInt(container.dataset.rank),
                name: container.dataset.name
            };
            selectedCard = { card, sourceId: container.parentElement.id };
        }

        function dragStart(e) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                suit: e.target.dataset.suit,
                rank: parseInt(e.target.dataset.rank),
                name: e.target.dataset.name,
                sourceId: e.target.parentElement.id
            }));
            e.target.classList.add('dragging');
            dragGhost = e.target.cloneNode(true);
            dragGhost.classList.add('drag-ghost');
            document.body.appendChild(dragGhost);
            dragGhost.style.left = `${e.pageX - dragGhost.offsetWidth / 2}px`;
            dragGhost.style.top = `${e.pageY - dragGhost.offsetHeight / 2}px`;
        }

        function touchStart(e) {
            e.preventDefault();
            const touches = e.touches;
            const target = e.currentTarget;
            if (touches.length === 2) {
                const rect = target.getBoundingClientRect();
                const touch1 = touches[0];
                const touch2 = touches[1];
                if (touch1.clientX >= rect.left && touch1.clientX <= rect.right &&
                    touch1.clientY >= rect.top && touch1.clientY <= rect.bottom &&
                    touch2.clientX >= rect.left && touch2.clientX <= rect.right &&
                    touch2.clientY >= rect.top && touch2.clientY <= rect.bottom) {
                    selectCard(target);
                    renderGame();
                }
            } else if (touches.length === 1) {
                target.touchStartTime = Date.now();
                target.touchStartX = touches[0].clientX;
                target.touchStartY = touches[0].clientY;
                target.isDragging = false;
            }
        }

        function touchMove(e) {
            const target = e.currentTarget;
            if (e.touches.length === 1 && !target.isDragging) {
                const touch = e.touches[0];
                const dx = touch.clientX - target.touchStartX;
                const dy = touch.clientY - target.touchStartY;
                if (Math.sqrt(dx * dx + dy * dy) > 10) {
                    target.isDragging = true;
                    if (!dragGhost) {
                        dragGhost = target.cloneNode(true);
                        dragGhost.classList.add('drag-ghost');
                        document.body.appendChild(dragGhost);
                    }
                    dragGhost.style.left = `${touch.pageX - dragGhost.offsetWidth / 2}px`;
                    dragGhost.style.top = `${touch.pageY - dragGhost.offsetHeight / 2}px`;
                    target.classList.add('dragging');
                }
            }
        }

        function touchEnd(e) {
            const target = e.currentTarget;
            if (target.isDragging) {
                const touch = e.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                if (dropTarget && (dropTarget.classList.contains('pile') || dropTarget.classList.contains('foundation'))) {
                    const data = {
                        suit: target.dataset.suit,
                        rank: parseInt(target.dataset.rank),
                        name: target.dataset.name,
                        sourceId: target.parentElement.id
                    };
                    const targetId = dropTarget.id;
                    const card = { suit: data.suit, rank: data.rank, name: data.name };
                    if (targetId.startsWith('tableau-')) {
                        const pileIndex = parseInt(targetId.split('-')[1]);
                        const targetPile = tableau[pileIndex];
                        const lastCard = targetPile[targetPile.length - 1];
                        if (targetPile.length === 0 || isValidTableauMove(card, lastCard)) {
                            moveCard(card, data.sourceId, targetId);
                        }
                    } else if (targetId.startsWith('foundation-')) {
                        const foundationSuit = targetId === 'foundation-r' ? 'republican' :
                                              targetId === 'foundation-d' ? 'democratic' : 'other';
                        const foundation = foundations[foundationSuit];
                        const lastCard = foundation[foundation.length - 1];
                        if (isValidFoundationMove(card, lastCard, foundationSuit)) {
                            moveCard(card, data.sourceId, targetId);
                        }
                    }
                }
                if (dragGhost) {
                    dragGhost.remove();
                    dragGhost = null;
                }
                target.classList.remove('dragging');
                renderGame();
            } else {
                const now = Date.now();
                if (target.lastTapTime && now - target.lastTapTime < 300) {
                    clearTimeout(target.tapTimeout);
                    const card = {
                        suit: target.dataset.suit,
                        rank: parseInt(target.dataset.rank),
                        name: target.dataset.name
                    };
                    ['republican', 'democratic', 'other'].forEach(suit => {
                        const foundation = foundations[suit];
                        const lastCard = foundation[foundation.length - 1];
                        if (isValidFoundationMove(card, lastCard, suit)) {
                            moveCard(card, target.parentElement.id, `foundation-${suit[0]}`);
                            selectedCard = null;
                            renderGame();
                        }
                    });
                } else {
                    target.tapTimeout = setTimeout(() => {
                        if (selectedCard && selectedCard.card.suit === target.dataset.suit &&
                            selectedCard.card.rank === parseInt(target.dataset.rank)) {
                            selectedCard = null;
                            renderGame();
                        }
                    }, 300);
                }
                target.lastTapTime = now;
            }
        }

        function handleDestinationTap(e) {
            if (selectedCard) {
                const destinationId = e.currentTarget.id;
                const card = selectedCard.card;
                if (destinationId.startsWith('tableau-')) {
                    const pileIndex = parseInt(destinationId.split('-')[1]);
                    const targetPile = tableau[pileIndex];
                    const lastCard = targetPile[targetPile.length - 1];
                    if (targetPile.length === 0 || isValidTableauMove(card, lastCard)) {
                        moveCard(card, selectedCard.sourceId, destinationId);
                        selectedCard = null;
                        renderGame();
                    }
                } else if (destinationId.startsWith('foundation-')) {
                    const foundationSuit = destinationId === 'foundation-r' ? 'republican' :
                                          destinationId === 'foundation-d' ? 'democratic' : 'other';
                    const foundation = foundations[foundationSuit];
                    const lastCard = foundation[foundation.length - 1];
                    if (isValidFoundationMove(card, lastCard, foundationSuit)) {
                        moveCard(card, selectedCard.sourceId, destinationId);
                        selectedCard = null;
                        renderGame();
                    }
                }
            }
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function drop(e) {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const sourceId = data.sourceId;
            const targetId = e.currentTarget.id;
            const card = { suit: data.suit, rank: data.rank, name: data.name };

            if (targetId.startsWith('tableau-')) {
                const pileIndex = parseInt(targetId.split('-')[1]);
                const targetPile = tableau[pileIndex];
                const lastCard = targetPile[targetPile.length - 1];
                if (targetPile.length === 0 || isValidTableauMove(card, lastCard)) {
                    moveCard(card, sourceId, targetId);
                }
            } else if (targetId.startsWith('foundation-')) {
                const foundationSuit = targetId === 'foundation-r' ? 'republican' :
                                      targetId === 'foundation-d' ? 'democratic' : 'other';
                const foundation = foundations[foundationSuit];
                const lastCard = foundation[foundation.length - 1];
                if (isValidFoundationMove(card, lastCard, foundationSuit)) {
                    moveCard(card, sourceId, targetId);
                }
            }
            if (dragGhost) {
                dragGhost.remove();
                dragGhost = null;
            }
            renderGame();
        }

        function isValidTableauMove(card, targetCard) {
            if (!targetCard) return true;
            const cardColor = card.suit;
            const targetColor = targetCard.suit;
            const isYellow = cardColor === 'other';
            const isTargetYellow = targetColor === 'other';
            if (isYellow || isTargetYellow) return true;
            if ((cardColor === 'republican' && targetColor === 'democratic') ||
                (cardColor === 'democratic' && targetColor === 'republican')) {
                return true;
            }
            return false;
        }

        function isValidFoundationMove(card, lastCard, foundationSuit) {
            if (card.suit !== foundationSuit) return false;
            const sequence = foundationSequences[foundationSuit];
            if (!lastCard) return card.rank === sequence[0];
            const nextRank = sequence[sequence.indexOf(lastCard.rank) + 1];
            return card.rank === nextRank;
        }

        function moveCard(card, sourceId, targetId) {
            let sourcePile, index;
            if (sourceId === 'waste') {
                if (waste[waste.length - 1].name !== card.name) return;
                sourcePile = waste;
                index = waste.length - 1;
            } else if (sourceId.startsWith('tableau-')) {
                const pileIndex = parseInt(sourceId.split('-')[1]);
                sourcePile = tableau[pileIndex];
                index = sourcePile.findIndex(c => c.name === card.name && c.rank === card.rank);
            }
            const movedCard = sourcePile.splice(index, 1)[0];
            movedCard.faceUp = true;
            if (targetId.startsWith('tableau-')) {
                const pileIndex = parseInt(targetId.split('-')[1]);
                tableau[pileIndex].push(movedCard);
            } else if (targetId.startsWith('foundation-')) {
                const foundationSuit = targetId === 'foundation-r' ? 'republican' :
                                      targetId === 'foundation-d' ? 'democratic' : 'other';
                foundations[foundationSuit].push(movedCard);
            }
        }

        function drawCards() {
            if (initialCards.length > 0) {
                initialCards.forEach(ic => {
                    clearTimeout(ic.timeout);
                    ic.element.remove();
                });
                initialCards = [];
            }
            gameStarted = true;
            if (stock.length > 0) {
                const cardsToDraw = Math.min(3, stock.length);
                for (let i = 0; i < cardsToDraw; i++) {
                    const card = stock.pop();
                    card.faceUp = true;
                    waste.push(card);
                }
            }
            renderGame();
        }

        function reshuffleStock() {
            stock = waste.reverse().map(card => ({ ...card, faceUp: false }));
            waste = [];
            stockReshuffles++;
            document.getElementById('stock-counter').textContent = `Reshuffles: ${stockReshuffles}`;
            renderGame();
        }

        function checkWin() {
            if (foundations.republican.length === 12 &&
                foundations.democratic.length === 12 &&
                foundations.other.length === 7) {
                gameInProgress = false;
                clearInterval(timerInterval);
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                let initials = prompt("Congratulations! You won Presidential Solitaire!\nEnter your initials (up to 3 characters):", "");
                if (initials) {
                    initials = initials.trim().toUpperCase().slice(0, 3);
                    saveScore(initials, elapsed);
                    showHighScores();
                }
                document.getElementById('new-game-button').style.display = 'block';
            }
        }

        document.getElementById('start-button').addEventListener('click', function() {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('game-area').style.display = 'block';
            initGame();
        });

        document.getElementById('new-game-button').addEventListener('click', initGame);

        document.getElementById('close-high-scores').addEventListener('click', function() {
            document.getElementById('high-score-screen').style.display = 'none';
        });

        document.querySelectorAll('[id^=tableau-], [id^=foundation-]').forEach(pile => {
            pile.addEventListener('dragover', dragOver);
            pile.addEventListener('drop', drop);
            pile.addEventListener('touchend', handleDestinationTap);
        });

        // Show "SHOW CARDS" button on touch devices
        if ('ontouchstart' in window) {
            document.getElementById('show-cards-button').style.display = 'block';
        }

        // Toggle card info visibility
        document.getElementById('show-cards-button').addEventListener('click', function() {
            document.getElementById('game-area').classList.toggle('show-card-info');
        });
   