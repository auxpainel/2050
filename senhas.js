// senhas.js - Nova versão corrigida
window.verificarSenha = function(senha) {
    const senhasValidas = [
        "tainara",
        "rick",
        "013179",
        "Bry2000",//1do11de2025
        "#Neymar10",//0401102025
        "1537",//10do11de2025
        "lacerda22",//29d11
        "2207"//dia28
];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};