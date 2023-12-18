// Wir importieren express und http Module 
// Mit diesen beiden Modulen veröffentlichen wir die HTML-Dateien
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Socket.io
var io = require('socket.io')(server);

// Starte den Webserver
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Webserver läuft und hört auf Port %d', port);
})

// Wo befinden sich die HTML-Dateien für express
app.use(express.static(__dirname + '/public'));

// Logge etwas, wenn es Veränderungen bei den Verbindungen gibt
// socket = Variable des aktuellen Websockets, Verbindung zu jeweiligen Browser Client
io.on('connection', function (socket){
    // Flag, ob User angemeldet
    var addUser = false;
    // Funktion reagiert auf Benutzeranmeldung
    socket.on('add user', function (username){
        // Speichere Benutzernamen in aktueller Socket-Verbindung
        socket.username = username;
        addedUser = true
        // Schicke User eine Login-Nachricht
        socket.emit('login');
        // Alle Clients informieren, dass ein neuer Benutzer angemeldet ist
        socket.broadcast.emit('user joined', socket.username);

    });
    // Funktion für wenn Benutzer eine neue Nachricht schreibt
    socket.on('new message', function (data){
        // Sende Nachricht an alle Clients
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // Funktion reagiert auf Abmeldung eines Nutzers
    // Kein explizites Abmelden, sondern auch ein Disconnect
    socket.on('disconnect', function () {
        if (addUser) {
            // Informiere alle über das Verlassen des Nutzers
            socket.broadcast.emit('user left', socket.username)
        }
    });

});