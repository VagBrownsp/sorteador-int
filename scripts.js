const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzshhdl4ryLqs5TwhKtKz07a4ateWX9uTPhuXTtLx0Yw7mlajmuJZkJUY_k-LE2Rwbf/exec";

const btn =
document.getElementById("btnSortear");

const mensagem =
document.getElementById("mensagem");

const resultado =
document.getElementById("resultadoSorteio");

btn.addEventListener(
"click",
async ()=>{

    mensagem.innerHTML =
    "⏳ Realizando sorteio...";

    resultado.innerHTML = "";

    try {

        const resposta =
        await fetch(SCRIPT_URL);

        const participantes =
        await resposta.json();

        if(participantes.length === 0){

            mensagem.innerHTML =
            "Nenhum participante encontrado.";

            return;
        }

        let quantidade =
        Number(
            document.getElementById("quantidade").value
        );

        quantidade =
        Math.min(
            quantidade,
            participantes.length
        );

        // embaralhar
        participantes.sort(
            ()=>Math.random()-0.5
        );

        const vencedores =
        participantes.slice(
            0,
            quantidade
        );

        mensagem.innerHTML =
        "✅ Sorteio realizado!";

        let html =
        "<h2>🏆 Vencedores</h2>";

        vencedores.forEach(
            (vencedor,index)=>{

                html += `
                <p>
                    ${index+1}º -
                    ${vencedor.nome}
                </p>
                `;
            }
        );

        resultado.innerHTML =
        html;

    } catch(erro){

        mensagem.innerHTML =
        "❌ Erro ao buscar participantes.";

        console.error(erro);
    }

});