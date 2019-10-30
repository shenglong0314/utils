(function($){



    var defaults={
        addButton:"#addButton",
        addBfore:function(obj){return true;},
        addAfter:function(obj){return true;},
        delBfore:function(obj){return true;},
        delAfter:function(obj){return true;},
        template:null,
        delButton:".delButton",
        this_:null,
        number:1,
        delOrder:false
    };



    $.fn.editTable = function(method){

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {

           var config = $.extend(defaults,method);
            return methods.init.call(this, config);
        } else {
            $.error('Method' + method + 'does not exist on jQuery.tooltip');
        }


    };




    var methods={

        getData:function(rowNumber,fun){
        var obj=new Array();
        var arrTr=this.find("tbody tr");
        $(arrTr).each(function(k,v){
            var rowDataJson=new Object();
            $.each($(v).find("input,select").serializeArray(),function(index,param){
                if(!(param.name in rowDataJson)){
                    rowDataJson[param.name]=param.value;
                }

            });
            if(rowNumber){
                if(k==rowNumber){
                    obj=rowDataJson;
                }
            }else {
                obj.push(rowDataJson);
            }
           });

           if(obj.length>0) fun(obj);else fun("");
         },


        init:function(obj){
            var $this=this;
            if(!obj.template){
               var length =  $(this).find("tbody  tr").length;
               if(length==1){
                   $(this).find("tbody  tr:last").find(obj.delButton).hide();
               }


            }
            $(obj.addButton).off("click").on("click",function(){

                var length = $this.find("tbody tr").length + 1;
                var lastTr = $this.find("tbody tr:last")
                if (!obj.template) {
                    $this.find("tbody tr:last").find(obj.delButton).show();

                };
                var add = lastTr.clone(true);
                if (obj.template) {
                    add = $(obj.template).find("tr:last").clone(true);
                }
                var addBfore = obj.addBfore(add);
                if(!addBfore)return;
                $(add).find("td").each(function(k,v){
                    if(k==0){
                        switch (obj.number) {
                            case 1:
                                $(this).text(length);
                                break;

                            case 2:
                                $(this).text(length);
                                $(this).find("input").val(length);
                                break;

                        }
                    }

                    $this.find("input,select").attr("id",$(this).find("input,select").attr("name")+length);

                });


                 add.find("input,select").val("");


                if(obj.delOrder){
                    lastTr.find("td:last button").hide();
                }


                $(add).appendTo($this.find("tbody"));
                var addAfter= obj.addAfter(add);
                if(!addAfter)return;


            });



            $(obj.delButton).off("click").click(function () {
                var length = $this.find("tbody tr").length;
                console.log("length1=" + length);
                if (!obj.template) {
                    if (length == 1) {
                        alert("未设置模板，首行不可删除")
                        return;
                    }
                }


                var delBfore = obj.delBfore(this);
                if (!delBfore) return;

                var copy = $(this).parents("tr");
                $(this).parents("tr").remove();

                length = $this.find("tbody tr").length;


                if (obj.delOrder) {
                    $this.find("tbody tr:last").find(obj.delButton).show();
                }
                console.log("length2=" + length);
                if (length == 1) {
                    if (!obj.template) {
                        $this.find("tbody tr:last").find(obj.delButton).hide();
                    }
                }


                if (obj.number == 1 || obj.number == 2) {
                    $this.find("tbody tr").each(function (k, v) {
                        $(this).find("td").each(function (i, j) {
                            if (i == 0) {
                                $(this).text(k + 1);
                                $(this).find("input").val(k + 1);
                            }
                        });
                    });

                }

                var delAfter = obj.delAfter(this);
                if (!delAfter) return;

            });


        },




    };



})(jQuery);


