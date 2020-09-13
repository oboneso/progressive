/* eslint-disable */ 
console.log('exercises1 connected')

// const password = document.querySelector('#password').value
// console.log(password)

const checkPassword = (user, pass) => {
  if (
    pass.length >= 8 &&
    !pass.includes(user) &&
    !pass.includes(' ')) {
    return true
  } return false
}

const numbers = [2342, 234, 23, 534, 3453]

const average = (arr) => {
  let total = 0
  for (let currentNum of arr) {
    total += currentNum 
  }
  const avg = total / arr.length
  return avg
}

const alphabet = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const pangram = "The five boxing wizards jump quick."

const checkSentence = (alph, sentence) => {
  let check = 0;
  const fixedSentence = sentence.toLowerCase();
  for (let char of alph) {
    if (!fixedSentence.includes(char)) {
      check += 1;
    }
  }
  if (check === 0) {
    console.log('Is pangram');
  } else {
    console.log('Is not pangram');
  }
}

const value = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suit = ['clubs', 'hearts', 'diamonds', 'spades']

const pickACard = (arr1, arr2) => {
  const randomValue = Math.floor(Math.random() * arr1.length)
  const randomSuit = Math.floor(Math.random() * arr2.length)
  return { value: value[randomValue], suit: suit[randomSuit] }
  // console.log(card)
}


const pick = (arr) => {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}

const getCard = (arr1, arr2) => {
  return { value: pick(arr1), suit: pick(arr2) }
}