const inputString = "aDFs:dfasdf#cFom:fortbaby#asdf#Fваня_уй #дом//овой #hdfdfddf23525%*&^(%f#jdfff     #d#рыбалка🎣,#dfdf";

// Используем регулярное выражение для поиска хештегов
const hashtagRegex = /#[^\s#]+/g;
const hashtags = inputString.match(hashtagRegex);

console.log(hashtags);