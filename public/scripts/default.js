/// <reference path="jquery-3.3.1.min.js" />


var socket;
$(document).ready(function () {
 socket = io.connect('http://localhost:1234');
 socket.on('connect', addUser);
 socket.on('updatechat', processMessage);
 socket.on('updateusers', updateUserList);
 $('#datasend').click(sendMessage);
 
 $('#file-send').click(sendFiles);//files

 $('#data').keypress(processEnterPress);
});

function addUser() {
    socket.emit('adduser', prompt("What's your name?"));
   }
   //file parameter added
   function processMessage(username, data, fileinput) {
    $('<b>' + username + ':</b> ' + data+ '<br />' +fileinput+ '<br />')
    .insertBefore($('#conversation'));
    
   }
   function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
    $('#users').append('<div>' + key + '</div>');
    });
   }
   function sendMessage() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
    $('#data').focus();
   }

   //files
   function sendFiles(){
    var files = $('#file-input').val();
    $('#file-input').val('');
    socket.emit('filemessage', files);
    $('#file-input').focus();
   }
   //

   function processEnterPress(e) {
    if (e.which == 13) {
    e.preventDefault();
    $(this).blur();
    $('#datasend').focus().click();
    }
   }