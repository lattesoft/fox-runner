class Fox {
    constructor(items) {
        this.items = items;
        this.foxInfo = {
            name: "Sammy",
            hp: 10,
            level: 1,
            status: "standing"
        }
        this.setName();
    }

    random(from, to) {
        return Math.floor(Math.random() * to) + from;
    }

    run() {
        switch (this.foxInfo.status) {
            case "standing": {
                $(".barrier-object").remove();
                $("#backgroundMusic")[0].play();
                this.foxInfo.status = "running";
                $("#background").addClass("background-running");
                $("#foxObject").removeClass("fox-standing").addClass("fox-running");
                this.randomItems();
                break;
            }
            case "running": {
                this.jump();
                break;
            }
        }
    }

    jump() {
        $("#foxObject").css("bottom", 150);
        this.foxInfo.status = "jumping";
        setTimeout(() => {
            $("#foxObject").css("bottom", 20);
            setTimeout(() => {
                this.foxInfo.status = "running";
            }, 500);
        }, 500);
    }

    end() {
        if (this.foxInfo.status !== "standing") {
            $('#gameOverModel').modal('show');
            $("#gameOverSound")[0].play();
            $("#backgroundMusic")[0].pause();
            this.foxInfo.status = "standing";
            $("#background").removeClass("background-running");
            $("#foxObject").removeClass("fox-running").addClass("fox-standing");
        }
    }

    randomItems() {
        if (this.foxInfo.status !== "standing") {
            setTimeout(() => {
                console.log(this.foxInfo);
                const item = new Item(this, this.items[this.random(0, 21)]);
                item.render();

                this.randomItems();

            }, this.random(1000, 2000));
        }
    }

    setName(name = this.foxInfo.name){
        if(name) this.foxInfo.name = name;
        $("#foxObject").tooltip("dispose").tooltip({
            title: name+", HP="+this.foxInfo.hp,
            trigger: "manual"
        }).tooltip('show');
    }
}

class Item {
    constructor(fox, item) {
        this.fox = fox;
        this.item = item;
        this.itemPass = false;
    }

    random(from, to) {
        return Math.floor(Math.random() * to) + from;
    }

    render() {
        let objectId = Date.now();
        $("#background").append(`
            <img style="left:100%;" class="barrier-object" id="item${objectId}" src="${this.item.url}"/>
        `);
        this.interval = setInterval(() => {
            if (this.fox.foxInfo.status === "standing") {
                clearInterval(this.interval);
                return;
            }
            let objectLeft = $("#item" + objectId).offset().left;
            let foxObject = $("#foxObject").offset().left;
            $("#item" + objectId).css("left", --objectLeft);
            let objectLeftDiffFox = objectLeft - foxObject;
            console.log(this.fox.foxInfo.status);
            if (objectLeftDiffFox > 0 && objectLeftDiffFox < 50 && this.fox.foxInfo.status !== "jumping") {

                if(!this.itemPass){
                    this.itemPass = true;
                    this.fox.foxInfo.hp = this.fox.foxInfo.hp + this.item.hp;
                    if(this.fox.foxInfo.hp < 0){
                        this.fox.foxInfo.hp = 0;
                    }
                    this.fox.setName();
                    $("#item" + objectId).remove();
                }

                if(this.fox.foxInfo.hp <= 0){
                    clearInterval(this.interval);
                    this.fox.end();
                }
                
            }

            if (objectLeft <= -100) {
                clearInterval(this.interval);
                $("#item" + objectId).remove();
            }
        }, 5.5);
    }
}