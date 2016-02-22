window.activeC = (newid) ->
  newid = newid.split(',')
  $('.sidebar ul li.active').removeClass('active')
  for i in newid
    id = '#'+i
    $(id).addClass('active')
  return
