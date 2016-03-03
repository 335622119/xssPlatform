class Koalas
  constructor: (name,callback)->
    @name = name
    callback
  sell: =>
    alert "test #{@name} !!"
#  发送数据
  send: (data)=>
    socket.emit('trans_data',data)
#  get,post 请求封装

