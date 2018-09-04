/*jshint esversion: 6 */
$(document).ready( function () {

  let contex = $(document).getElementById('#canvas').getContext("2d");

  $("#open").on('click', function functionName() {

  });

  $("#start").on('click', function functionName() {

  });

  $("#save").on('click', function functionName() {

  });

  //let filters = document.querySelector('.filters');
  let filters = document.getElementsByClassName('filters');
  filters.addEventListener('click', function(e) {
    if (e.target !== e.currentTarget) {
      e.preventDefault();
      let name = e.target.getAttribute('href');
      filter(name);
    }
    e.stopPropagation();
  }, false);

});
