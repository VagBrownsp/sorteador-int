const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbzshhdl4ryLqs5TwhKtKz07a4ateWX9uTPhuXTtLx0Yw7mlajmuJZkJUY_k-LE2Rwbf/exec";

const btn = document.getElementById("btnSortear");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultadoSorteio");

btn.addEventListener("click", realizarSorteio);

// ==========================
// Carrega participantes via JSONP
// ==========================
function carregarParticipantes() {

    return new Promise((resolve, reject) => {

        const callback = "jsonp_" + Date.now();

        window[callback] = function (dados) {

            resolve(dados);

            delete window[callback];

            script.remove();

        };

        const script = document.createElement("script");

        script.src = SCRIPT_URL + "?callback=" + callback;

        script.onerror = () => {

            delete window[callback];

            reject(new Error("Erro ao carregar participantes."));

        };

        document.body.appendChild(script);

    });

}

// ==========================
// Sorteio
// ==========================
async function realizarSorteio() {

    btn.disabled = true;

    resultado.innerHTML = "";

    mensagem.className = "loading";

    mensagem.innerHTML = "⏳ Buscando participantes...";

    try {

        const participantes = await carregarParticipantes();

        console.log(participantes);

        if (!Array.isArray(participantes)) {

            throw new Error("Resposta inválida do Apps Script.");

        }

        if (participantes.length === 0) {

            throw new Error("Nenhum participante encontrado.");

        }

        let quantidade =
            Number(document.getElementById("quantidade").value);

        quantidade = Math.min(quantidade, participantes.length);

        // Fisher-Yates
        for (let i = participantes.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [participantes[i], participantes[j]] =
            [participantes[j], participantes[i]];

        }

        const vencedores =
            participantes.slice(0, quantidade);

        let html = "<h2>🏆 Vencedores</h2>";

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

        mensagem.innerHTML = "✅ Sorteio realizado com sucesso!";

    }

    catch (erro) {

        console.error(erro);

        mensagem.className = "erro";

        mensagem.innerHTML = erro.message;

    }

    finally {

        btn.disabled = false;

    }

}