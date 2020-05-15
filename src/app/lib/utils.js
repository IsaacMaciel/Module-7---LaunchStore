module.exports = {



    date(timestamp) {
        const birth = new Date(timestamp);

        const year = birth.getUTCFullYear();
        const month = `0${birth.getUTCMonth() + 1}`.slice(-2);
        const day = `0${birth.getUTCDate()}`.slice(-2);
        const hour = birth.getHours();
        const minutes = birth.getMinutes();


        return {
            year,
            month,
            day,
            hour,
            minutes,
            format:`${day}/${month}/${year}`,
            birthDay: `${day}/${month}`,
            iso:`${year}-${month}-${day}`
        }

    },
    formatPrice(price) {
        
        return new Intl.NumberFormat('pt-BR',{
            style: 'currency',
            currency:'BRL'
        }).format(price/100)
    },

    formatCpfCnpj(value) {
        value = value.replace(/\D/g,"");

        if(value.length > 14) value = value.slice(0,-1);

        //check if is  cnpj -12.123.123/1234-12
        if (value.length > 11) {
            //cnpj
            value = value.replace(/(\d{2})(\d)/,"$1.$2");
            value = value.replace(/(\d{3})(\d)/,"$1.$2");
            value = value.replace(/(\d{3})(\d)/,"$1/$2");
            value = value.replace(/(\d{4})(\d)/,"$1-$2");        
        } else {
            //cpf
            value = value.replace(/(\d{3})(\d)/,"$1.$2");
            value = value.replace(/(\d{3})(\d)/,"$1.$2");
            value = value.replace(/(\d{3})(\d)/,"$1-$2");         
        }
        return value;
    },
    formatCep(value) {
        value = value.replace(/\D/g,"");
        if(value.length > 8) value = value.slice(0,-1);
        value = value.replace(/(\d{5})(\d)/,"$1-$2");

        return value;
    }

}
