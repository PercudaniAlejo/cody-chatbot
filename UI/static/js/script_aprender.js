let conocerintent=false;
$('.usrInput').on('keyup keypress', function (e) {
	var keyCode = e.keyCode || e.which;
	var text = $(".usrInput").val();
	if (keyCode === 13) {
		if (text == "" || $.trim(text) == '') {//trim elimina espacios demas
			e.preventDefault();
			return false;
		} else {
            if(!conocerintent){
                saberIntent(text)
                conocerintent=true;
            }else{
                nuevaRespuesta(text)
                conocerintent= false;
            }
            setUserResponse(text);
            e.preventDefault();
		}
	}
});
function saberIntent(message){
    console.log("mensaje a enviar a la api: " + message)
	fetch('http://localhost:8080/buscar-intent', {
		method: 'POST',
		body: JSON.stringify({
			"message": message,
		}),
	})
}

let btnEntrenar = document.getElementById('btnEntrenar')
btnEntrenar.addEventListener('click', ()=>{
	fetch('http://localhost:8080/iniciar-train', {
		method: 'POST',
		body: JSON.stringify({
			"message": true,
		}),
	})
})

function nuevaRespuesta(message){
	console.log("mensaje a enviar a la api: " + message)
	fetch('http://localhost:8080/nuevas-respuestas', {
		method: 'POST',
		body: JSON.stringify({
			"message": message,
		}),
	})
}


// Mostrar respuesta de usuario
function setUserResponse(val) {
	var UserResponse = '<img class="userAvatar" src=' + "./static/img/userAvatar.jpg" + '><p class="userMsg">' + val + ' </p><div class="clearfix"></div>';
	$(UserResponse).appendTo('.chats').show('slow');
	$(".usrInput").val('');
	scrollToBottomOfResults();
	$('.suggestions').remove();
}

// Scroll automÃ¡tico en el chat
function scrollToBottomOfResults() {
	var terminalResultsDiv = document.getElementById('chats');
	terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

function send(message) {
	console.log("Mensaje de usuario:", message)

	$.ajax({
		url: 'http://localhost:5005/webhooks/rest/webhook',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"message": message,
			"sender": "Me"
		}),
		success: function (data, textStatus) {
			if(data != null){
				setBotResponse( data, message);

			}
			console.log("Rasa Response: ", data, "\n Status:", textStatus)
		}
	});
}

// Mostrar respuesta del bot
function setBotResponse(val, message) {
	console.log(val)
	setTimeout(function () {
		if (val.length < 1) {

			msg = 'I couldn\'t get that. Let\' try something else!';

			var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
			$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
			
			newIntent(message);
			comprobarMensaje=false;
		} else {
			//if we get response from Rasa
			for (i = 0; i < val.length; i++) {
				//check if there is text message
				if (val[i].hasOwnProperty("text")) {
					var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + val[i].text + '</p><div class="clearfix"></div>';
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is image
				if (val[i].hasOwnProperty("image")) {
					var BotResponse = '<div class="singleCard">' +
						'<img class="imgcard" src="' + val[i].image + '">' +
						'</div><div class="clearfix">'
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is  button message
				if (val[i].hasOwnProperty("buttons")) {
					addSuggestion(val[i].buttons);
				}

			}
			scrollToBottomOfResults();
		}

	}, 500);
}
// function Aprender(message){
//     fetch('http://localhost:8080/nuevo-intent', {
//         method: 'POST',
//         body: JSON.stringify({
//             "message": message,
//         }),
//     })
// }