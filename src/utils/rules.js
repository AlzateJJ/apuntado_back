function pinta(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return  Mano.every(carta => carta.suit === "diamante")  ||
            Mano.every(carta => carta.suit === "picas")    ||
            Mano.every(carta => carta.suit === "trebol")     ||
            Mano.every(carta => carta.suit === "corazón");
};

/*
ESTRUCTURA DE LAS FUNCIONES  ->  return ((p&q&r&s..) || ((x||y||z||w) & (p&q&r&s..)))
func(){
    return (Comprobación de si son cartas 
            de misma denominación pero
            diferente pinta             )   ||
          ((Comprobación para ver si son
            cartas de la misma pinta    )   &&
           (Comprobación para ver si son 
           escalera                     );
};

*/
function septima_1_7(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[0].rank === Mano[1].rank &&
            Mano[0].rank === Mano[2].rank &&
            Mano[0].rank === Mano[3].rank &&
            Mano[0].rank === Mano[4].rank &&
            Mano[0].rank === Mano[5].rank &&
            Mano[0].rank === Mano[6].rank   ) ||
          ((Mano.slice(0,7).every(carta => carta.suit === "diamante")   ||
            Mano.slice(0,7).every(carta => carta.suit === "picas")     ||
            Mano.slice(0,7).every(carta => carta.suit === "trebol")      ||
            Mano.slice(0,7).every(carta => carta.suit === "corazón"))    &&
          ((Mano[0].rank === Mano[1].rank - 1) &&
           (Mano[0].rank === Mano[2].rank - 2) &&
           (Mano[0].rank === Mano[3].rank - 3) &&
           (Mano[0].rank === Mano[4].rank - 4) &&
           (Mano[0].rank === Mano[5].rank - 5) &&
           (Mano[0].rank === Mano[6].rank - 6)  ));
};

function septima_4_10(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[3].rank === Mano[4].rank &&
            Mano[3].rank === Mano[5].rank &&
            Mano[3].rank === Mano[6].rank &&
            Mano[3].rank === Mano[7].rank &&
            Mano[3].rank === Mano[8].rank &&
            Mano[3].rank === Mano[9].rank   ) ||
          ((Mano.slice(3,10).every(carta => carta.suit === "diamante")  ||
            Mano.slice(3,10).every(carta => carta.suit === "picas")    ||
            Mano.slice(3,10).every(carta => carta.suit === "trebol")     ||
            Mano.slice(3,10).every(carta => carta.suit === "corazón"))   &&
          ((Mano[3].rank === Mano[4].rank - 1) &&
           (Mano[3].rank === Mano[5].rank - 2) &&
           (Mano[3].rank === Mano[6].rank - 3) &&
           (Mano[3].rank === Mano[7].rank - 4) &&
           (Mano[3].rank === Mano[8].rank - 5) &&
           (Mano[3].rank === Mano[9].rank - 6)   ));
};




function sexta_1_6(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[0].rank === Mano[1].rank &&
            Mano[0].rank === Mano[2].rank &&
            Mano[0].rank === Mano[3].rank &&
            Mano[0].rank === Mano[4].rank &&
            Mano[0].rank === Mano[5].rank   ) ||
          ((Mano.slice(0,6).every(carta => carta.suit === "diamante")   ||
            Mano.slice(0,6).every(carta => carta.suit === "picas")     ||
            Mano.slice(0,6).every(carta => carta.suit === "trebol")      ||
            Mano.slice(0,6).every(carta => carta.suit === "corazón"))    &&
          ((Mano[0].rank === Mano[1].rank - 1) &&
           (Mano[0].rank === Mano[2].rank - 2) &&
           (Mano[0].rank === Mano[3].rank - 3) &&
           (Mano[0].rank === Mano[4].rank - 4) &&
           (Mano[0].rank === Mano[5].rank - 5)   ));
};

function sexta_4_9(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[3].rank === Mano[4].rank &&
            Mano[3].rank === Mano[5].rank &&
            Mano[3].rank === Mano[6].rank &&
            Mano[3].rank === Mano[7].rank &&
            Mano[3].rank === Mano[8].rank   ) ||
          ((Mano.slice(3,9).every(carta => carta.suit === "diamante")   ||
            Mano.slice(3,9).every(carta => carta.suit === "picas")     ||
            Mano.slice(3,9).every(carta => carta.suit === "trebol")      ||
            Mano.slice(3,9).every(carta => carta.suit === "corazón"))    &&
          ((Mano[3].rank === Mano[4].rank - 1) &&
           (Mano[3].rank === Mano[5].rank - 2) &&
           (Mano[3].rank === Mano[6].rank - 3) &&
           (Mano[3].rank === Mano[7].rank - 4) &&
           (Mano[3].rank === Mano[8].rank - 5)   ));
};

function sexta_5_10(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[4].rank === Mano[5].rank &&
            Mano[4].rank === Mano[6].rank &&
            Mano[4].rank === Mano[7].rank &&
            Mano[4].rank === Mano[8].rank &&
            Mano[4].rank === Mano[9].rank   ) ||
          ((Mano.slice(4,10).every(carta => carta.suit === "diamante")   ||
            Mano.slice(4,10).every(carta => carta.suit === "picas")     ||
            Mano.slice(4,10).every(carta => carta.suit === "trebol")      ||
            Mano.slice(4,10).every(carta => carta.suit === "corazón"))    &&
          ((Mano[4].rank === Mano[5].rank - 1) &&
           (Mano[4].rank === Mano[6].rank - 2) &&
           (Mano[4].rank === Mano[7].rank - 3) &&
           (Mano[4].rank === Mano[8].rank - 4) &&
           (Mano[4].rank === Mano[9].rank - 5)   ));
};




function quinta_1_5(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[0].rank === Mano[1].rank &&
            Mano[0].rank === Mano[2].rank &&
            Mano[0].rank === Mano[3].rank &&
            Mano[0].rank === Mano[4].rank   ) ||
          ((Mano.slice(0,5).every(carta => carta.suit === "diamante")   ||
            Mano.slice(0,5).every(carta => carta.suit === "picas")     ||
            Mano.slice(0,5).every(carta => carta.suit === "trebol")      ||
            Mano.slice(0,5).every(carta => carta.suit === "corazón"))    &&
          ((Mano[0].rank === Mano[1].rank - 1) &&
           (Mano[0].rank === Mano[2].rank - 2) &&
           (Mano[0].rank === Mano[3].rank - 3) &&
           (Mano[0].rank === Mano[4].rank - 4)   ));
};

function quinta_4_8(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[3].rank === Mano[4].rank &&
            Mano[3].rank === Mano[5].rank &&
            Mano[3].rank === Mano[6].rank &&
            Mano[3].rank === Mano[7].rank   ) ||
          ((Mano.slice(3,8).every(carta => carta.suit === "diamante")   ||
            Mano.slice(3,8).every(carta => carta.suit === "picas")     ||
            Mano.slice(3,8).every(carta => carta.suit === "trebol")      ||
            Mano.slice(3,8).every(carta => carta.suit === "corazón"))    &&
          ((Mano[3].rank === Mano[4].rank - 1) &&
           (Mano[3].rank === Mano[5].rank - 2) &&
           (Mano[3].rank === Mano[6].rank - 3) &&
           (Mano[3].rank === Mano[7].rank - 4)   ));
};

function quinta_5_9(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[4].rank === Mano[5].rank &&
            Mano[4].rank === Mano[6].rank &&
            Mano[4].rank === Mano[7].rank &&
            Mano[4].rank === Mano[8].rank   ) ||
          ((Mano.slice(4,9).every(carta => carta.suit === "diamante")   ||
            Mano.slice(4,9).every(carta => carta.suit === "picas")     ||
            Mano.slice(4,9).every(carta => carta.suit === "trebol")      ||
            Mano.slice(4,9).every(carta => carta.suit === "corazón"))    &&
          ((Mano[4].rank === Mano[5].rank - 1) &&
           (Mano[4].rank === Mano[6].rank - 2) &&
           (Mano[4].rank === Mano[7].rank - 3) &&
           (Mano[4].rank === Mano[8].rank - 4)   ));
};

function quinta_6_10(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[5].rank === Mano[6].rank &&
            Mano[5].rank === Mano[7].rank &&
            Mano[5].rank === Mano[8].rank &&
            Mano[5].rank === Mano[9].rank   ) ||
          ((Mano.slice(5,10).every(carta => carta.suit === "diamante")  ||
            Mano.slice(5,10).every(carta => carta.suit === "picas")    ||
            Mano.slice(5,10).every(carta => carta.suit === "trebol")     ||
            Mano.slice(5,10).every(carta => carta.suit === "corazón"))   &&
          ((Mano[5].rank === Mano[6].rank - 1) &&
           (Mano[5].rank === Mano[7].rank - 2) &&
           (Mano[5].rank === Mano[8].rank - 3) &&
           (Mano[5].rank === Mano[9].rank - 4)   ));
};




function cuarta_1_4(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[0].rank === Mano[1].rank &&
            Mano[0].rank === Mano[2].rank &&
            Mano[0].rank === Mano[3].rank   ) ||
          ((Mano.slice(0,4).every(carta => carta.suit === "diamante")   ||
            Mano.slice(0,4).every(carta => carta.suit === "picas")     ||
            Mano.slice(0,4).every(carta => carta.suit === "trebol")      ||
            Mano.slice(0,4).every(carta => carta.suit === "corazón"))    &&
          ((Mano[0].rank === Mano[1].rank - 1) &&
           (Mano[0].rank === Mano[2].rank - 2) &&
           (Mano[0].rank === Mano[3].rank - 3)   ));
};

function cuarta_4_7(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[3].rank === Mano[4].rank &&
            Mano[3].rank === Mano[5].rank &&
            Mano[3].rank === Mano[6].rank   ) ||
          ((Mano.slice(3,7).every(carta => carta.suit === "diamante")   ||
            Mano.slice(3,7).every(carta => carta.suit === "picas")     ||
            Mano.slice(3,7).every(carta => carta.suit === "trebol")      ||
            Mano.slice(3,7).every(carta => carta.suit === "corazón"))    &&
          ((Mano[3].rank === Mano[4].rank - 1) &&
           (Mano[3].rank === Mano[5].rank - 2) &&
           (Mano[3].rank === Mano[6].rank - 3)   ));
};

function cuarta_5_8(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[4].rank === Mano[5].rank &&
            Mano[4].rank === Mano[6].rank &&
            Mano[4].rank === Mano[7].rank   ) ||
          ((Mano.slice(4,8).every(carta => carta.suit === "diamante")   ||
            Mano.slice(4,8).every(carta => carta.suit === "picas")     ||
            Mano.slice(4,8).every(carta => carta.suit === "trebol")      ||
            Mano.slice(4,8).every(carta => carta.suit === "corazón"))    &&
          ((Mano[4].rank === Mano[5].rank - 1) &&
           (Mano[4].rank === Mano[6].rank - 2) &&
           (Mano[4].rank === Mano[7].rank - 3)   ));
};

function cuarta_6_9(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[5].rank === Mano[6].rank &&
            Mano[5].rank === Mano[7].rank &&
            Mano[5].rank === Mano[8].rank   ) ||
          ((Mano.slice(5,9).every(carta => carta.suit === "diamante")   ||
            Mano.slice(5,9).every(carta => carta.suit === "picas")     ||
            Mano.slice(5,9).every(carta => carta.suit === "trebol")      ||
            Mano.slice(5,9).every(carta => carta.suit === "corazón"))    &&
          ((Mano[5].rank === Mano[6].rank - 1) &&
           (Mano[5].rank === Mano[7].rank - 2) &&
           (Mano[5].rank === Mano[8].rank - 3)   ));
};

function cuarta_7_10(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[6].rank === Mano[7].rank &&
            Mano[6].rank === Mano[8].rank &&
            Mano[6].rank === Mano[9].rank   ) ||
          ((Mano.slice(6,10).every(carta => carta.suit === "diamante")  ||
            Mano.slice(6,10).every(carta => carta.suit === "picas")    ||
            Mano.slice(6,10).every(carta => carta.suit === "trebol")     ||
            Mano.slice(6,10).every(carta => carta.suit === "corazón"))   &&
          ((Mano[6].rank === Mano[7].rank - 1) &&
           (Mano[6].rank === Mano[8].rank - 2) &&
           (Mano[6].rank === Mano[9].rank - 3)   ));
};




function terna_1_3(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[0].rank === Mano[1].rank &&
            Mano[0].rank === Mano[2].rank   ) ||
          ((Mano.slice(0,3).every(carta => carta.suit === "diamante")   ||
            Mano.slice(0,3).every(carta => carta.suit === "picas")     ||
            Mano.slice(0,3).every(carta => carta.suit === "trebol")      ||
            Mano.slice(0,3).every(carta => carta.suit === "corazón"))    &&
          ((Mano[0].rank === Mano[1].rank - 1) &&
           (Mano[0].rank === Mano[2].rank - 2)   ));
};

function terna_4_6(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[3].rank === Mano[4].rank &&
            Mano[3].rank === Mano[5].rank   ) ||
          ((Mano.slice(3,6).every(carta => carta.suit === "diamante")   ||
            Mano.slice(3,6).every(carta => carta.suit === "picas")     ||
            Mano.slice(3,6).every(carta => carta.suit === "trebol")      ||
            Mano.slice(3,6).every(carta => carta.suit === "corazón"))    &&
          ((Mano[3].rank === Mano[4].rank - 1) &&
           (Mano[3].rank === Mano[5].rank - 2) ));
};

function terna_5_7(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[4].rank === Mano[5].rank &&
            Mano[4].rank === Mano[6].rank   ) ||
          ((Mano.slice(4,7).every(carta => carta.suit === "diamante")   ||
            Mano.slice(4,7).every(carta => carta.suit === "picas")     ||
            Mano.slice(4,7).every(carta => carta.suit === "trebol")      ||
            Mano.slice(4,7).every(carta => carta.suit === "corazón"))    &&
          ((Mano[4].rank === Mano[5].rank - 1) &&
           (Mano[4].rank === Mano[6].rank - 2)   ));
};

function terna_6_8(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[5].rank === Mano[6].rank &&
            Mano[5].rank === Mano[7].rank   ) ||
          ((Mano.slice(5,8).every(carta => carta.suit === "diamante")   ||
            Mano.slice(5,8).every(carta => carta.suit === "picas")     ||
            Mano.slice(5,8).every(carta => carta.suit === "trebol")      ||
            Mano.slice(5,8).every(carta => carta.suit === "corazón"))    &&
          ((Mano[5].rank === Mano[6].rank - 1) &&
           (Mano[5].rank === Mano[7].rank - 2)   ));
};

function terna_7_9(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[6].rank === Mano[7].rank &&
            Mano[6].rank === Mano[8].rank   ) ||
          ((Mano.slice(6,9).every(carta => carta.suit === "diamante")   ||
            Mano.slice(6,9).every(carta => carta.suit === "picas")     ||
            Mano.slice(6,9).every(carta => carta.suit === "trebol")      ||
            Mano.slice(6,9).every(carta => carta.suit === "corazón"))    &&
          ((Mano[6].rank === Mano[7].rank - 1) &&
           (Mano[6].rank === Mano[8].rank - 2)   ));
};

function terna_8_10(Mano){
	Mano.map(card => card.rank = +(card.rank))
    return (Mano[7].rank === Mano[8].rank &&
            Mano[7].rank === Mano[9].rank   ) ||
          ((Mano.slice(7,10).every(carta => carta.suit === "diamante")  ||
            Mano.slice(7,10).every(carta => carta.suit === "picas")    ||
            Mano.slice(7,10).every(carta => carta.suit === "trebol")     ||
            Mano.slice(7,10).every(carta => carta.suit === "corazón"))   &&
          ((Mano[7].rank === Mano[8].rank - 1) &&
           (Mano[7].rank === Mano[9].rank - 2)   ));
};

module.exports = {

  pinta, 

  septima_1_7, 
  septima_4_10, 

  sexta_1_6, 
  sexta_4_9, 
  sexta_5_10, 

  quinta_1_5, 
  quinta_4_8, 
  quinta_5_9, 
  quinta_6_10,

  cuarta_1_4, 
  cuarta_4_7, 
  cuarta_5_8, 
  cuarta_6_9, 
  cuarta_7_10,

  terna_1_3, 
  terna_4_6, 
  terna_5_7, 
  terna_6_8, 
  terna_7_9, 
  terna_8_10, 

}
