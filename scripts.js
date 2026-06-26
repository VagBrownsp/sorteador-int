const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzJni2U4M7wBjpa_JPGDbuXJkDEh5GIVkEXyk3CpvGQ_e9QmjJewfxbGVDvlpjrzHqe/exec";

const btn = document.getElementById("btnSortear");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultadoSorteio");

btn.addEventListener("click", realizarSorteio);
function carregarParticipantes() {

    return new Promise((resolve, reject) => {

        const callback =
            "jsonp_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 100000);

        const script =
            document.createElement("script");

        let timeout;

        function limpar() {

            clearTimeout(timeout);

            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }

            delete window[callback];

        }

        window[callback] = function (dados) {

            limpar();

            if (!Array.isArray(dados)) {

                reject(
                    new Error(
                        "Resposta inválida do Apps Script."
                    )
                );

                return;

            }

            resolve(dados);

        };

        script.src =
            SCRIPT_URL +
            "?callback=" +
            callback +
            "&_=" +
            Date.now();

        script.async = true;

        script.onerror = function () {

            limpar();

            reject(
                new Error(
                    "Não foi possível carregar os participantes."
                )
            );

        };

        timeout = setTimeout(() => {

            limpar();

            reject(
                new Error(
                    "Tempo de resposta excedido."
                )
            );

        }, 15000);

        document.head.appendChild(script);

    });

}

async function realizarSorteio() {

    btn.disabled = true;

    resultado.innerHTML = "";

    mensagem.className = "loading";

    mensagem.innerHTML =
        "⏳ Buscando participantes...";

    try {

        const participantes =
            await carregarParticipantes();

        if (participantes.length === 0) {

            throw new Error(
                "Nenhum participante encontrado."
            );

        }

        let quantidade =
            parseInt(
                document.getElementById("quantidade").value,
                10
            );

        if (isNaN(quantidade) || quantidade < 1) {

            quantidade = 1;

        }

        quantidade =
            Math.min(
                quantidade,
                participantes.length
            );

        for (
            let i = participantes.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                participantes[i],
                participantes[j]
            ] = [
                participantes[j],
                participantes[i]
            ];

        }

        const vencedores =
            participantes.slice(0, quantidade);

        let html =
            "<h2>🏆 Vencedores</h2>";

        vencedores.forEach((vencedor, index) => {

            html += `
                <div class="vencedor">

                    🥇 ${index + 1}º Sorteado

                    <br><br>

                    ${vencedor.nome}

                </div>
            `;

        });

        resultado.innerHTML = html;

        mensagem.className = "sucesso";

        mensagem.innerHTML =
            "✅ Sorteio realizado com sucesso!";

    }

    catch (erro) {

        console.error("Erro:", erro);

        mensagem.className = "erro";

        mensagem.innerHTML = erro.message;

    }

    finally {

        btn.disabled = false;

    }

}