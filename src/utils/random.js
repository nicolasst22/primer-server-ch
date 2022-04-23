
((num) => {
    let a = {};
    for (i = 0; i < num; i++) {
        let n = Math.floor(Math.random() * (num - 1)) + 1;
        a[n] = a[n] ? (a[n]+1 ): 1;
    }
    process.send(a);

})(process.argv[2])