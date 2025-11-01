/* --------------------- Name Check ---------------------- */
function verifyName() {
    const nameInput = document.querySelector('[name="name"]').value;
    if (!nameInput || nameInput.trim() === "") {
        alert("Please enter your name");
        return false; // stop processing
    }
    return true;
}

/* ---------------------- Room Cost ---------------------- */
function calculateCost(tier, staytime) {
    const baseCost = 150;
    let roomCost;

    if (tier === "3") roomCost = baseCost;
    else if (tier === "2") roomCost = baseCost + (baseCost * 0.7);
    else if (tier === "premium") roomCost = baseCost + (baseCost * 1.8);
    else throw new Error("Invalid tier");

    if (staytime === 1) return roomCost;

    return roomCost + ((staytime - 1) * (roomCost * 0.6));
}

/* ---------------------- Perks Cost ---------------------- */
function calculatePerksCost(selectedPerks) {
    let totalCost = 0;
    let discountableCost = 0;

    selectedPerks.forEach(perk => {
        if (perk === "threem") {
            totalCost += 30;
            discountableCost += 30;
        } else if (perk === "fibopt") totalCost += 10;
        // freej is free
    });

    return { totalCost, discountableCost };
}

/* ---------------------- Arrival Fee ---------------------- */
function calculateArrivalFee(arrivalInput) {
    const now = new Date();
    const arrivalDate = new Date(arrivalInput);
    const diffDays = Math.ceil((arrivalDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) return 50;
    else if (diffDays <= 7) return 20;
    else return 10;
}

/* ---------------------- Discount ---------------------- */
function applyDiscount(amount, discountRate) {
    return amount * (1 - discountRate);
}

/* ---------------------- T&C verification ---------------------- */
function checkTaC() {
    const TaC = document.querySelector('[name="tnc"]:checked');
    
    if (!TaC) {
        alert("You shall not pass without agreeing to our T&Cs");
        return false;
    }

    if (TaC.value === "disagree") {
        alert("You shall not pass without agreeing to our T&Cs");
        return false;
    }

    // If "agree" is selected
    return true;
}


/* ---------------------- Logging Function ---------------------- */
function logReservation(configs, finalTotal) {
    const logEntry = `
[${new Date().toLocaleString()}]
Name: ${configs.name}
Tier: ${configs.tier}
Staytime: ${configs.staytime}
Arrival: ${configs.arrival}
Perks: ${configs.perks.join(', ') || 'None'}
Coupon: ${configs.coupon || 'None'}
Total Cost: $${finalTotal.toFixed(2)}
-------------------------------
`;

    console.log(logEntry);
}

/* ---------------------- Main Reservation Handler ---------------------- */
function handleReservation(configs) {
    if (!verifyName()) return; // stop if name invalid
    if (!checkTaC()) return; // stop if user doesnt agree

    const roomCost = calculateCost(configs.tier, configs.staytime);
    const { totalCost: perksCost, discountableCost: discountablePerksCost } = calculatePerksCost(configs.perks);
    const arrivalFee = calculateArrivalFee(configs.arrival);

    const coupons = { "STUDENT50": 0.5, "HALF25": 0.25 };
    const discountRate = configs.coupon && coupons[configs.coupon] || 0;
    const discountableTotal = roomCost + discountablePerksCost;
    const discountedTotal = applyDiscount(discountableTotal, discountRate);

    const finalTotal = discountedTotal + (perksCost - discountablePerksCost) + arrivalFee;

    logReservation(configs, finalTotal);
}

/* ---------------------- Event Listener ---------------------- */
document.querySelector('[name="complete"]').addEventListener("click", function() {
    const reservationConfig = {
        name: document.querySelector('[name="name"]').value,
        tier: document.querySelector('[name="tier"]').value,
        staytime: parseInt(document.querySelector('[name="staytime"]').value, 10),
        arrival: document.querySelector('[name="arrivaldt"]').value,
        perks: Array.from(document.querySelectorAll('[name="perks"]:checked')).map(cb => cb.value),
        coupon: document.querySelector('[name="coupon"]').value
    };

    handleReservation(reservationConfig);
});
