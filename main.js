$(document).ready(function(){
  
  var game = {
    players: [],
    addPlayer: function(name){
      var new_player = playerConstructor(name);
      this.players.push(new_player);
      return this;
    },
    deal: function(){
      // dealer starts game with one card face down and one 'real' card showing 
      game.players[0].addCard();
      // player starts with two cards showing
      game.players[1].addCard().addCard();
    },
    // cards are generated randomly - no deck to shuffle so shuffle function just empties the hands
    shuffle: function(){
      for(i in game.players){
        game.players[i].hand = [];
      }
    }
  };

  game.addPlayer('dealer').addPlayer('player');


  $('#hit').hide();
  $('#stay').hide();




  function Card(){
        var suit = ["A","B","C","D"];
      
        var face = [1,2,3,4,5,6,7,8,9,'A','B','D','E'] // 'C' intentionally skipped bc unicode includes 'knight' between jack and queen
        this.value = face[Math.floor(Math.random()*13)];
        this.suit = suit[Math.floor(Math.random()*4)];
        this.name = "&#x1F0"+this.suit+this.value
  };

  function playerConstructor(name){
    player = {};
    player.name = name;
    player.hand = [];

    player.addCard = function(){
      var card = new Card();
      this.hand.push(card);
      return this;
    };

    // return numerical total of cards in hand
    player.showing = function(){
      var showing = 0;
      var ace = false;
      for(c in this.hand){
        if(typeof(this.hand[c]['value']) == 'number'){
          showing += this.hand[c]['value'];
          if(this.hand[c]['value'] == 1){
            ace = true;
          }
        }
        else{
          showing += 10;
        }
      }
      // count an ace as 11 if it won't bust the hand
      if(ace == true && showing <= 11){
        showing +=10;
      }
      
      return showing;
    }
    
    return player;
  };




  
  $('#deal').click(function(){
    game.shuffle();
    game.deal();

    var player_hand = "";
    
  
    for(c in game.players[1].hand){  
      player_hand += "<p class='card'>"+game.players[1].hand[c]['name']+"</p>";
    }
    
    // dealer's first card face down
    $('#dealer').html("<p class='card'>&#x1F0A0</p><p class='card'>"+game.players[0].hand[0]['name']+"</p>");
    $('.hand').html(player_hand)
    $('#dealer_showing').html("Dealer Showing  "+game.players[0].showing());
    $('#player_showing').html("You have  "+game.players[1].showing());
     
    $('#deal').hide();
    $('#hit').show();
    $('#stay').show();
  });


  // hit
  $('#hit').click(function(){
    
    game.players[1].addCard();
    var player_hand = $('.hand').html();
  
    var hand_length = game.players[1].hand.length;
    $('.hand').html(player_hand+"<p class='card'>"+game.players[1].hand[hand_length-1]['name']+"</p>");
    $('#player_showing').html("You have  "+game.players[1].showing());
    
    if(game.players[1].showing() > 21){
      $('#player_showing').html("You went bust with  "+game.players[1].showing()+".  Deal Again?");
      $('#deal').show();
      $('#hit').hide();
      $('#stay').hide();
    }

  })

  // stay
  $('#stay').click(function(){
    $('#hit').hide();
    $('#stay').hide();
    
    // dealer actually started game w/ one card so give the dealer their second card
    game.players[0].addCard();

    var dealer_hand = "";
    for(c in game.players[0].hand){
      dealer_hand += "<p class='card'>"+game.players[0].hand[c]['name']+"</p>";
    }
    
    $('#dealer_showing').html("Dealer Showing  "+game.players[0].showing());
    $('#dealer').html(dealer_hand);

    // dealer hits until 17, then stays
    while(game.players[0].showing() < 17){
      game.players[0].addCard();
      $('#dealer_showing').html("Dealer Showing  "+game.players[0].showing());
      dealer_hand += "<p class='card'>"+game.players[0].hand[game.players[0].hand.length-1]['name']+"</p>";
      $('#dealer').html(dealer_hand);
    }
    if(game.players[0].showing() <= 21 && game.players[0].showing() > game.players[1].showing() ){
      $('#dealer_showing').html("Dealer has  "+game.players[0].showing()+".  You Lose.  Deal Again?");

    }
    else if(game.players[0].showing() <= 21 && game.players[0].showing() == game.players[1].showing()){
      $('#dealer_showing').html("Dealer has  "+game.players[0].showing()+".  Push, nobody wins.  Deal Again?");
    }
    else{
      $('#dealer_showing').html("Dealer has  "+game.players[0].showing()+".  You Win!  Deal Again?");
    }

    $('#deal').show();
  })


})


