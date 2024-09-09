const { Client, MessageMedia, LocalAuth, Buttons, MessageTypes, List  } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const commander = require('commander')
const axios = require('axios')
const urlRegex = require('url-regex')

const STICKER_COMMAND = "/sticker"

const MediaType = {
    Image: { contentType: "image/jpeg", fileName: "image.jpg" },
    Video: { contentType: "video/mp4", fileName: "image.mp4" }
}

// Parse command line arguments
commander
    .usage('[OPTIONS]...')
    .option('-d, --debug', 'Show debug logs', false)
    .option('-c, --chrome <value>', 'Use a installed Chrome Browser')
    .option('-f, --ffmpeg <value>', 'Use a different ffmpeg')
    .parse(process.argv)

const options = commander.opts()

const log_debug = options.debug ? console.log : () => { }
const puppeteerConfig = !options.chrome ? { executablePath: "/usr/bin/chromium-browser", args: ['--no-sandbox'] } : { executablePath: "/usr/bin/chromium-browser", args: ['--no-sandbox'] }
const ffmpegPath = options.ffmpeg ? options.ffmpeg : undefined

// Inicialize WhatsApp Web client
const client = new Client({
    authStrategy: new LocalAuth(),
    ffmpegPath,
    puppeteer: puppeteerConfig,
    webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
})

const generateSticker = async (msg, sender) => {
    if (msg.type === "image") {
        log_debug()
        const { data } = await msg.downloadMedia()
        await sendMediaSticker(sender, MediaType.Image, data)
    } else if (msg.type === "video") {
        const { data } = await msg.downloadMedia()
        console.log(data)
        const resp = await sendMediaSticker(sender, MediaType.Video, data)
        console.log(resp)

    } else if (msg.type === "chat") {
        let url = msg.body.split(" ").reduce((acc, elem) => acc ? acc : (urlRegex().test(elem) ? elem : false), false)
        if (url) {
            log_debug("URL:", url)
            let { data, headers } = await axios.get(url, { responseType: 'arraybuffer' })
            data = Buffer.from(data).toString('base64');
            let mediaType;
            if (headers['content-type'].includes("image")) {
                mediaType = MediaType.Image
            } else if (headers['content-type'].includes("video")) {
                mediaType = MediaType.Video
            } else {
                msg.reply("❌ Erro, URL inválida!")
                return
            }
            await sendMediaSticker(sender, mediaType, data)
        } else {
            msg.reply("❌ Erro, URL inválida!")
        }
    }
}

const sendMediaSticker = async (sender, type, data) => {
    const media = new MessageMedia(type.contentType, data, type.fileName)
    await client.sendMessage(sender, media, { sendMediaAsSticker: true })
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
    console.log('Wpp-Sticker is ready!')
})

client.on('message_create', async msg => {
    if (msg.body.split(" ")[0] === (STICKER_COMMAND)) {
        log_debug("User:", client.info.wid.user, "To:", msg.to, "From:", msg.from)
        const sender = msg.from.startsWith(client.info.wid.user) ? msg.to : msg.from
        try {
            await generateSticker(msg, sender)
        } catch (e) {
            console.log(e, JSON.stringify(msg, null, 4))
            msg.reply("❌ Erro ao gerar Sticker!")
        }
    }
})

client.initialize()

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

client.on('message', async msg => {

    if (msg.body.match(/(Olá!|informações|interesse|Interesse|gostaria|Informações|Gostaria|Olá|olá|ola|Ola|Oi|oi)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await msg.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await client.sendMessage(msg.from,'*Olá* '+ name.split(" ")[0] + '!\n\n*Sou o Vitor, assistente virtual da La Vita Planejados!*\n_Como posso ajudar?_\n\n*Por favor, digite uma das opções abaixo:*\n\n1 - Realizar projeto\n2 - Assistência técnica\n3 - Acompanhar entrega\n4 - Outros assuntos'); //Primeira mensagem de texto
        
    
        
    }




    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Maravilha!* Vou pedir para que digite os ambientes que gostaria de planejar.\n\nCaso possua a planta do imóvel, pode nos encaminhar pois irá auxiliar na construção do seu projeto.\n\nSe for sua primeira experiência com planejados ou a primeira empresa que está realizando sua cotação, não se preocupe pois iremos dar o suporte que for preciso.');

        await delay(120000); //delay de 120 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Logo um de nossos atendentes dará continuidade ao seu atendimento.*\n\nCaso ainda não conheça nosso instagram, irei deixar o *link abaixo* enquanto aguarda o seu atendimento.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'https://www.instagram.com/la_vita_planejados?igsh=b3VweXg2bHVxYm50&utm_source=qr');


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '_Gostaria de lembrar que nosso atendimento funciona de segunda à sábado das 08:00hs às 20:00hs._');



    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Perfeito, logo um de nossos atendentes dará continuidade para lhe auxiliar em sua assistência técnica.*\n\nEnquanto isso pode ficar à vontade para decrever o problema apresentado.\n\nCaso consiga nos enviar fotos ou vídeos, ficamos gratos, pois irá nos auxiliar a entender melhor o ocorrido.');


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '_Gostaria de lembrar que nosso atendimento funciona de segunda à sábado das 08:00hs às 20:00hs._');


    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Você já está muito perto de ver seu sonho realizado.\n\n*Logo um de nossos atendentes dará continuidade ao seu atendimento.*');
        
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '_Gostaria de lembrar que nosso atendimento funciona de segunda à sábado das 08:00hs às 20:00hs._');

    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Não tem problema, logo um de nossos atendentes dará continuidade ao seu atendimento.*\n\nCaso ainda não conheça nosso instagram, irei deixar o *link abaixo* enquanto aguarda o seu atendimento.');


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'https://www.instagram.com/la_vita_planejados?igsh=b3VweXg2bHVxYm50&utm_source=qr');


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '_Gostaria de lembrar que nosso atendimento funciona de segunda à sábado das 08:00hs às 20:00hs._');



    }








});