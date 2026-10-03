function startSandbox() {
    window.gameState.mode = 'sandbox';
    window.gameState.level = null;
  
    menu.style.display = 'none';
  
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'main.js';
  
    document.body.appendChild(script);
  }
  



    window.gameState = {
        mode: null,
        level: null
    };
  

    const levels = {
        1: {
            atoms: [{"x":2,"y":2.5,"vx":0,"vy":0,"dragging":false,"particles":[{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"}],"bonds":[],"age":2.1250000000000004,"protons":82,"neutrons":126,"electronsTotal":82,"charge":0,"symbolBase":"Pb","color":"#A0522D","valenceMax":4,"name":"Lead","electrons":4,"mass":208,"baseRadius":218,"halfLifeTooltip":["STABLE",""],"halflife":null,"gameLifeTime":120,"needsToBreakBonds":false,"playerOwned":true,"highlightType":"normal","highlightColor":"#222"}]
        },
        2:{
            atoms: [{"x":105.00440645663184,"y":1463.0718213958685,"vx":0,"vy":0,"dragging":false,"particles":[{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"}],"bonds":[],"age":-1,"protons":5,"neutrons":5,"electronsTotal":5,"charge":0,"symbolBase":"B","color":"#FF8C00","valenceMax":3,"name":"Boron","electrons":3,"mass":10,"baseRadius":20,"halfLifeTooltip":["STABLE",""],"halflife":null,"gameLifeTime":120,"needsToBreakBonds":false,"playerOwned":true,"highlightType":"normal","highlightColor":"#222"},{"x":1654.6104500675265,"y":540.540894903133,"vx":0,"vy":0,"dragging":false,"particles":[{"type":"p"},{"type":"n"},{"type":"e"}],"bonds":[],"age":-1,"protons":1,"neutrons":1,"electronsTotal":1,"charge":0,"symbolBase":"H","color":"#FFFFFF","valenceMax":1,"name":"Hydrogen","electrons":1,"mass":2,"baseRadius":12,"halfLifeTooltip":["STABLE",""],"halflife":null,"gameLifeTime":120,"needsToBreakBonds":false,"playerOwned":true,"highlightType":"normal","highlightColor":"#222"},{"x":953.0488998465885,"y":-1433.1888617491484,"vx":0,"vy":0,"dragging":false,"particles":[{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"p"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"n"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"},{"type":"e"}],"bonds":[],"age":-1,"protons":5,"neutrons":5,"electronsTotal":5,"charge":0,"symbolBase":"B","color":"#FF8C00","valenceMax":3,"name":"Boron","electrons":3,"mass":10,"baseRadius":20,"halfLifeTooltip":["STABLE",""],"halflife":null,"gameLifeTime":120,"needsToBreakBonds":false,"playerOwned":true,"highlightType":"normal","highlightColor":"#222"}]
        }
      };
      
      function openLevels() {
        menu.innerHTML = `
          <h1>Levels (WIP)</h1>
          ${Object.keys(levels)
            .map(level => `
              <button onclick="startLevel(${level})">
                Niveau ${level}
              </button>
            `)
            .join('')}
          <button onclick="backToMenu()">Retour</button>
        `;
      }
      
      function startLevel(level) {
        window.gameState.mode = 'level';
        window.gameState.level = level;
      
        menu.style.display = 'none';
      
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'main.js';
      
        document.body.appendChild(script);
      }
      
      


      function backToMenu() {
        menu.innerHTML = `
          <h1>Nuclewar</h1>
          <button onclick="startSandbox()">Sandbox</button>
          <button onclick="openLevels()">Levels</button>
        `;
      }