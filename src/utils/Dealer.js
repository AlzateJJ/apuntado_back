const rules = require('./rules.js')

const validarBajarse = (player) => {
    const H = player.cards;
    const Hand = JSON.parse(JSON.stringify(H));

    if (rules.pinta(Hand)){
        for (let i = 0; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (rules.septima_1_7(Hand)){
        for (let i = 0; i < 7; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.septima_4_10(Hand)){
        for (let i = 3; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (rules.sexta_1_6(Hand)){
        for (let i = 0; i < 6; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.sexta_4_9(Hand)){
        for (let i = 3; i < 9; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.sexta_5_10(Hand)){
        for (let i = 4; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (rules.quinta_1_5(Hand)){
        for (let i = 0; i < 5; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.quinta_4_8(Hand)){
        for (let i = 3; i < 8; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.quinta_5_9(Hand)){
        for (let i = 4; i < 9; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.quinta_6_10(Hand)){
        for (let i = 5; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (rules.cuarta_1_4(Hand)){
        for (let i = 0; i < 4; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.cuarta_4_7(Hand)){
        for (let i = 3; i < 7; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.cuarta_5_8(Hand)){
        for (let i = 4; i < 8; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.cuarta_6_9(Hand)){
        for (let i = 5; i < 9; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.cuarta_7_10(Hand)){
        for (let i = 6; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (rules.terna_1_3(Hand)){
        for (let i = 0; i < 3; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.terna_4_6(Hand)){
        for (let i = 3; i < 6; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.terna_5_7(Hand)){
        for (let i = 4; i < 7; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.terna_6_8(Hand)){
        for (let i = 5; i < 8; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.terna_7_9(Hand)){
        for (let i = 6; i < 9; i++){
            Hand[i].suit = "Replaced";
        };
    };

    if (rules.terna_8_10(Hand)){
        for (let i = 7; i < 10; i++){
            Hand[i].suit = "Replaced";
        };
    };


    if (Hand.some(carta => carta.suit !== "Replaced")){
        return false;
    };
    return true;
};

const validarTocar = (player,card1,card2=null) => {
    if ((card2 !== null) && (card1.rank + card2.rank > 5)){return false}
    else if ((card2 === null) && (card1.rank > 5)){return false}
    else{
        const H = player.cards;
        const Hand = JSON.parse(JSON.stringify(H));
        if (card2 !== null){
            Hand[8].suit = "Replaced";
            Hand[9].suit = "Replaced";
        }
        else if (card2 === null){
            Hand[9].suit = "Replaced";
        };
    };
    if (card2 === null){

        if (rules.septima_1_7(Hand)){
            for (let i = 0; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.sexta_1_6(Hand)){
            for (let i = 0; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.sexta_4_9(Hand)){
            for (let i = 3; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.quinta_1_5(Hand)){
            for (let i = 0; i < 5; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_4_8(Hand)){
            for (let i = 3; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_5_9(Hand)){
            for (let i = 4; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.cuarta_1_4(Hand)){
            for (let i = 0; i < 4; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_4_7(Hand)){
            for (let i = 3; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_5_8(Hand)){
            for (let i = 4; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_6_9(Hand)){
            for (let i = 5; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.terna_1_3(Hand)){
            for (let i = 0; i < 3; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_4_6(Hand)){
            for (let i = 3; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_5_7(Hand)){
            for (let i = 4; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_6_8(Hand)){
            for (let i = 5; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_7_9(Hand)){
            for (let i = 6; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    }
    else{
        if (rules.septima_1_7(Hand)){
            for (let i = 0; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.sexta_1_6(Hand)){
            for (let i = 0; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.quinta_1_5(Hand)){
            for (let i = 0; i < 5; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_4_8(Hand)){
            for (let i = 3; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.cuarta_1_4(Hand)){
            for (let i = 0; i < 4; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_4_7(Hand)){
            for (let i = 3; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_5_8(Hand)){
            for (let i = 4; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.terna_1_3(Hand)){
            for (let i = 0; i < 3; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_4_6(Hand)){
            for (let i = 3; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_5_7(Hand)){
            for (let i = 4; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_6_8(Hand)){
            for (let i = 5; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    };
    
    if (Hand.some(carta => carta.suit !== "Replaced")){
        return false;
    };
    return true;
};

const comprobarManos = (winner, otros, tocar = 0) => {
    let resultsList = {}
    const WH = winner.cards;
    if (tocar === 1){
        // winner.points += WH[9].rank;
        resultsList[winner.id] = WH[9].rank;
    }
    else if (tocar === 2){
        // winner.points += WH[9].rank + WH[8].rank;
        resultsList[winner.id] = WH[9].rank + WH[8].rank;
    }
    else if (rules.pinta(WH)){
        // winner.points -= 25;
        resultsList[winner.id] = -25;
    }
    else{
        // winner.points -= 10;
        resultsList[winner.id] = -10;
    };


    for (let i = 0; i< otros.length; i++){
        player = otros[i]
        H = player.cards;
        const Hand = JSON.parse(JSON.stringify(H));
        let pts = 0;

        if (rules.pinta(Hand)){
            for (let i = 0; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.septima_1_7(Hand)){
            for (let i = 0; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.septima_4_10(Hand)){
            for (let i = 3; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.sexta_1_6(Hand)){
            for (let i = 0; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.sexta_4_9(Hand)){
            for (let i = 3; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.sexta_5_10(Hand)){
            for (let i = 4; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.quinta_1_5(Hand)){
            for (let i = 0; i < 5; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_4_8(Hand)){
            for (let i = 3; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_5_9(Hand)){
            for (let i = 4; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.quinta_6_10(Hand)){
            for (let i = 5; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.cuarta_1_4(Hand)){
            for (let i = 0; i < 4; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_4_7(Hand)){
            for (let i = 3; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_5_8(Hand)){
            for (let i = 4; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_6_9(Hand)){
            for (let i = 5; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.cuarta_7_10(Hand)){
            for (let i = 6; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
    
        if (rules.terna_1_3(Hand)){
            for (let i = 0; i < 3; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_4_6(Hand)){
            for (let i = 3; i < 6; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_5_7(Hand)){
            for (let i = 4; i < 7; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_6_8(Hand)){
            for (let i = 5; i < 8; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_7_9(Hand)){
            for (let i = 6; i < 9; i++){
                Hand[i].suit = "Replaced";
            };
        };
    
        if (rules.terna_8_10(Hand)){
            for (let i = 7; i < 10; i++){
                Hand[i].suit = "Replaced";
            };
        };

        for (let j = 0; j < 10; j++){
            if (Hand[j].suit !== "Replaced"){
                pts += Hand[j].rank;
            };
        };

        resultsList[player.id] = pts
        // player.points += pts;
    };
    return resultsList
};

module.exports = {
    validarBajarse,
    validarTocar,
    comprobarManos
}