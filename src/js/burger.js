const burger = document.querySelector(".burger-menu")
const navigation = document.querySelector('.navbar')
const line = document.querySelector('.line')

burger.addEventListener("click", function() {
    navigation.classList.toggle("hidden")
    line.classList.toggle('line')
    line.classList.toggle('cross')

})
