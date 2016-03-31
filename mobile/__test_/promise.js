describe('util', function () {
    it('promise', function () {
        // var p=Promise.resolve('hello');
        // p.then(function (res) {
        //     console.log(res)
        // })
        var add=function(a,b){
            return a+b
        }
        Promise.resolve(add(3,4))
            .then(function (res) {
                console.log(res)
            })

    })
})