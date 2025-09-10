class AbrigoAnimais {

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // Dados dos animais
    const animais = {
      'rex':  { nome: 'Rex',  especie: 'cao',   brinquedos: ['RATO','BOLA'] },
      'mimi': { nome: 'Mimi', especie: 'gato',  brinquedos: ['BOLA','LASER'] },
      'fofo': { nome: 'Fofo', especie: 'gato',  brinquedos: ['BOLA','RATO','LASER'] },
      'zero': { nome: 'Zero', especie: 'gato',  brinquedos: ['RATO','BOLA'] },
      'bola': { nome: 'Bola', especie: 'cao',   brinquedos: ['CAIXA','NOVELO'] },
      'bebe': { nome: 'Bebe', especie: 'cao',   brinquedos: ['LASER','RATO','BOLA'] },
      'loco': { nome: 'Loco', especie: 'jabuti',brinquedos: ['SKATE','RATO'] }
    };

    // Conjunto de brinquedos válidos
    const brinquedosValidos = new Set();
    Object.values(animais).forEach(a => a.brinquedos.forEach(b => brinquedosValidos.add(b)));

    // Normalização e validação
    const parseList = (s) => {
      if (typeof s !== 'string') return [];
      return s.split(',')
        .map(x => x.trim())
        .filter(x => x !== '')
    };

    const toUpperArray = (arr) => arr.map(x => x.toUpperCase());

    const pessoa1ListRaw = parseList(brinquedosPessoa1);
    const pessoa2ListRaw = parseList(brinquedosPessoa2);
    const animaisOrderRaw = parseList(ordemAnimais);

    const pessoa1Toys = toUpperArray(pessoa1ListRaw);
    const pessoa2Toys = toUpperArray(pessoa2ListRaw);

    // Brinquedos duplicados dentro da mesma lista?
    const hasDuplicates = (arr) => new Set(arr).size !== arr.length;
    if (hasDuplicates(pessoa1Toys) || hasDuplicates(pessoa2Toys)) {
      return { erro: 'Brinquedo inválido' };
    }

    // Brinquedos válidos
    for (const b of pessoa1Toys.concat(pessoa2Toys)) {
      if (!brinquedosValidos.has(b)) {
        return { erro: 'Brinquedo inválido' };
      }
    }

    // Animais válidos e sem duplicatas
    const animaisLower = animaisOrderRaw.map(a => a.trim()).filter(x => x !== '');
    const lowerKeys = animaisLower.map(a => a.toLowerCase());
    if (new Set(lowerKeys).size !== lowerKeys.length) {
      return { erro: 'Animal inválido' };
    }
    for (const aLower of lowerKeys) {
      if (!(aLower in animais)) {
        return { erro: 'Animal inválido' };
      }
    }

    // Função que verifica subsequência
    const isSubsequence = (pattern, arr) => {
      if (!pattern || pattern.length === 0) return true;
      let idx = 0;
      for (const item of arr) {
        if (item === pattern[idx]) {
          idx++;
          if (idx === pattern.length) return true;
        }
      }
      return false;
    };

    // Verificar se a pessoa tem todos os brinquedos (em qualquer ordem)
    const setFrom = (arr) => new Set(arr);

    // Processamento na ordem informada
    let adotadosPessoa1 = 0;
    let adotadosPessoa2 = 0;
    const resultados = []; // { nome, resultadoString }

    // Processar na ordem fornecida
    for (const nomeRaw of animaisLower) {
      const key = nomeRaw.toLowerCase();
      const animal = animais[key];
      const fav = animal.brinquedos; // array uppercase

      // Verificar qual pessoa qualifica (respeitando limite de 3)
      let qualifica1 = false;
      let qualifica2 = false;

      if (key === 'loco') {
        // Loco aceita brinquedos em qualquer ordem: precisa ter TODOS os brinquedos (subset)
        const set1 = setFrom(pessoa1Toys);
        const set2 = setFrom(pessoa2Toys);
        const needsAll = fav.every(b => set1.has(b));
        const needsAll2 = fav.every(b => set2.has(b));

        // Regra de "companhia": Loco só pode ser adotado se já houver outro animal adotado
        const temCompanhia = (adotadosPessoa1 + adotadosPessoa2) > 0;

        qualifica1 = needsAll && temCompanhia && (adotadosPessoa1 < 3);
        qualifica2 = needsAll2 && temCompanhia && (adotadosPessoa2 < 3);
      } else {
        // Verifica subsequência (ordem relativa)
        qualifica1 = isSubsequence(fav, pessoa1Toys) && (adotadosPessoa1 < 3);
        qualifica2 = isSubsequence(fav, pessoa2Toys) && (adotadosPessoa2 < 3);
      }

      let resultadoStr;
      if (qualifica1 && !qualifica2) {
        adotadosPessoa1++;
        resultadoStr = `${animal.nome} - pessoa 1`;
      } else if (!qualifica1 && qualifica2) {
        adotadosPessoa2++;
        resultadoStr = `${animal.nome} - pessoa 2`;
      } else {
        // inclui casos: ambos qualificados, nenhum qualificado, ou ambos desqualificados por limite
        resultadoStr = `${animal.nome} - abrigo`;
      }

      resultados.push({ nome: animal.nome, res: resultadoStr });
    }

    // Ordenar alfabeticamente pelo nome do animal e retornar somente as strings
    resultados.sort((a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()));
    const lista = resultados.map(r => r.res);

    return { lista, erro: false };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
