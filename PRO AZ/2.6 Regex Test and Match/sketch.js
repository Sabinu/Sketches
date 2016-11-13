var srctext
var words

function preload () {
  srctext = loadStrings('hello.txt')
}

function diastic (seed, words) {
  var phrase = ''
  var currentWord = 0

  for (var i = 0; i < seed.length; i++) {
    var c = seed.charAt(i)

    for (var j = currentWord; j < words.length; j++) {
      if (words[j].charAt(i) === c) {
        phrase += words[j]
        phrase += ' '

        currentWord = j + 1
        // console.log(words[j])
        break
      }
    }
  }
  return phrase
}
// ====================================================

function setup () {
  noCanvas()
  srctext = join(srctext, ' ')
  words = splitTokens(srctext, ' ",.!?()\'-')
  new_words = join(words, ' ')

  var seed = select('#seed')
  var submit = select('#submit')

  submit.mousePressed(function () {
    var phrase = diastic(seed.value(), words)
    createP(phrase)
    // createP(seed.value())
    // createP(new_words)
  })
}
