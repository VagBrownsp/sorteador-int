const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxXCr5SgEY9rxFPf2wdfT-rXwvMPPzbxVt9w5_otL2_dl0Ez-gBH31iij8I3CUlq_2r/exec";

const btn = document.getElementById("btnSortear");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultadoSorteio");

btn.addEventListener("click", realizarSorteio);

async function realizarSorteio() {

    btn.disabled = true;

    resultado.innerHTML = "";

    mensagem.className = "loading";

    mensagem.innerHTML = "⏳ Buscando participantes...";

    try {

        const resposta = await fetch(SCRIPT_URL);

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP " + resposta.status
            );

        }

        const participantes = await resposta.json();

        console.log(participantes);

        if (!Array.isArray(participantes)) {

            throw new Error(
                "O Apps Script não retornou uma lista."
            );

        }

        if (participantes.length === 0) {

            mensagem.className = "erro";

            mensagem.innerHTML =
                "Nenhum participante encontrado.";

            return;

        }

        let quantidade =
            Number(
                document.getElementById("quantidade").value
            );

        quantidade = Math.min(
            quantidade,
            participantes.length
        );

        participantes.sort(() => Math.random() - 0.5);

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

        console.error(erro);

        mensagem.className = "erro";

        mensagem.innerHTML =
            erro.message;

    }

    finally {

        btn.disabled = false;

    }

}