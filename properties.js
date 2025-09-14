document.addEventListener('DOMContentLoaded', () => {

    const galleryGrid = document.querySelector('.gallery-grid');
    const priceFilter = document.getElementById('price-range');
    const roomsFilter = document.getElementById('rooms');
    const locationFilter = document.getElementById('location');
    const sortByFilter = document.getElementById('sort-by');

    // Hypothekenrechner-Elemente
    const purchasePriceInput = document.getElementById('purchase-price');
    const downPaymentInput = document.getElementById('down-payment');
    const interestRateInput = document.getElementById('interest-rate');
    const amortizationInput = document.getElementById('amortization');
    const monthlyPaymentEl = document.getElementById('monthly-payment');

    // Beispieldaten für Immobilien
    const properties = [
        { id: 1, title: 'Elegante Stadtwohnung', rooms: 4.5, price: 1200000, location: 'Zürich', image: 'Salford-Property-1.jpg' },
        { id: 2, title: 'Exklusives Penthouse', rooms: 5.5, price: 'Preis auf Anfrage', location: 'Luzern', image: 'Salford-Property-2.jpg' },
        { id: 3, title: 'Familienhaus im Grünen', rooms: 6.5, price: 1850000, location: 'Zug', image: 'Salford-Property-3.jpg' },
        { id: 4, title: 'Exklusive Penthouse-Wohnung', rooms: 3.5, price: 3800000, location: 'Genf', image: 'Salford-Property-4.jpg' },
        { id: 5, title: 'Einfamilienhaus', rooms: 4.5, price: 1550000, location: 'Bern', image: 'Salford-Property-5.jpg' },
        { id: 6, title: 'Modernes Landhaus', rooms: 5.5, price: 2100000, location: 'Graubünden', image: 'Salford-Property-6.jpg' },
    ];

    // Funktion zum Rendern der Immobilien
    const renderProperties = (filteredProperties) => {
        galleryGrid.innerHTML = '';
        
        if (filteredProperties.length === 1) {
            galleryGrid.classList.add('single-result');
        } else {
            galleryGrid.classList.remove('single-result');
        }

        if (filteredProperties.length === 0) {
            galleryGrid.innerHTML = '<p class="no-results">Leider keine Immobilien gefunden, die Ihren Kriterien entsprechen.</p>';
            return;
        }

        filteredProperties.forEach(property => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            let priceDisplay;
            if (typeof property.price === 'number') {
                priceDisplay = `CHF ${property.price.toLocaleString('de-CH')}`;
            } else {
                priceDisplay = property.price;
            }

            card.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <div class="gallery-card-text">
                    <h3>${property.title}</h3>
                    <p>${property.location} • ${property.rooms} Zimmer</p>
                    <span class="price">${priceDisplay}</span>
                </div>
            `;
            galleryGrid.appendChild(card);
        });
    };

    // Filterfunktion
    const filterProperties = () => {
        const selectedPrice = priceFilter.value;
        const selectedRooms = roomsFilter.value;
        const selectedLocation = locationFilter.value;

        return properties.filter(property => {
            let priceMatch = false;
            if (selectedPrice === 'all') {
                priceMatch = true;
            } else if (typeof property.price === 'number') {
                priceMatch = property.price <= parseInt(selectedPrice);
            }

            let roomsMatch = false;
            if (selectedRooms === 'all') {
                roomsMatch = true;
            } else {
                roomsMatch = property.rooms >= parseFloat(selectedRooms);
            }
            
            const locationMatch = selectedLocation === 'all' || property.location === selectedLocation;

            return priceMatch && roomsMatch && locationMatch;
        });
    };
    
    // Sortierfunktion
    const sortProperties = (propertiesToSort) => {
        const selectedSort = sortByFilter.value;

        if (selectedSort === 'default') {
            return propertiesToSort;
        }

        return propertiesToSort.sort((a, b) => {
            // Spezialbehandlung für 'Preis auf Anfrage'
            const priceA = typeof a.price === 'number' ? a.price : (selectedSort === 'price_asc' ? Infinity : -Infinity);
            const priceB = typeof b.price === 'number' ? b.price : (selectedSort === 'price_asc' ? Infinity : -Infinity);

            if (selectedSort === 'price_asc') {
                return priceA - priceB;
            } else if (selectedSort === 'price_desc') {
                return priceB - priceA;
            }
            return 0;
        });
    };

    // Kombinierte Filter- und Sortierfunktion
    const filterAndSort = () => {
        const filteredResults = filterProperties();
        const sortedResults = sortProperties(filteredResults);
        renderProperties(sortedResults);
    };

    // Hypothekenrechner-Funktion
    const calculateMortgage = () => {
        const purchasePrice = parseFloat(purchasePriceInput.value);
        const downPaymentPercentage = parseFloat(downPaymentInput.value) / 100;
        const interestRate = parseFloat(interestRateInput.value) / 100 / 12;
        const loanTermMonths = parseFloat(amortizationInput.value) * 12;

        if (isNaN(purchasePrice) || isNaN(downPaymentPercentage) || isNaN(interestRate) || isNaN(loanTermMonths) || purchasePrice <= 0) {
            monthlyPaymentEl.textContent = "Ungültige Eingabe";
            return;
        }

        const loanAmount = purchasePrice * (1 - downPaymentPercentage);
        const monthlyRate = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTermMonths));

        if (isFinite(monthlyRate) && !isNaN(monthlyRate)) {
            monthlyPaymentEl.textContent = `CHF ${Math.round(monthlyRate).toLocaleString('de-CH')}`;
        } else {
            monthlyPaymentEl.textContent = "Berechnung nicht möglich";
        }
    };
    
    // Event-Listener für Filter und Rechner
    priceFilter.addEventListener('change', filterAndSort);
    roomsFilter.addEventListener('change', filterAndSort);
    locationFilter.addEventListener('change', filterAndSort);
    sortByFilter.addEventListener('change', filterAndSort);

    purchasePriceInput.addEventListener('input', calculateMortgage);
    downPaymentInput.addEventListener('input', calculateMortgage);
    interestRateInput.addEventListener('input', calculateMortgage);
    amortizationInput.addEventListener('input', calculateMortgage);

    // Initiales Rendern und Berechnen
    filterAndSort();
    calculateMortgage();
});