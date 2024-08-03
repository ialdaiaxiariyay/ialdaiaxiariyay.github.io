function sendMsg(event, message) {
    event.player.sendSystemMessage(message);
}

let corner1 = null;
let corner2 = null;

// 处理选择方块的事件
BlockEvents.broken((event) => {
    const player = event.player;
    const block = event.block;

    if (player.mainHandItem.id === "minecraft:wooden_hoe") {
        corner1 = { x: block.x, y: block.y, z: block.z };

        player.sendSystemMessage(
            Component.literal("Corner1: ").append(
                Component.red(`x: ${corner1.x}, `)
                    .append(Component.green(`y: ${corner1.y}, `))
                    .append(Component.blue(`z: ${corner1.z}`))
            )
        );
        event.cancel(true);
    } else if (player.offHandItem.id === "minecraft:wooden_hoe") {
        corner2 = { x: block.x, y: block.y, z: block.z };

        player.sendSystemMessage(
            Component.literal("Corner2: ").append(
                Component.red(`x: ${corner2.x}, `)
                    .append(Component.green(`y: ${corner2.y}, `))
                    .append(Component.blue(`z: ${corner2.z}`))
            )
        );
        event.cancel(true);
    }
});

// 获取方块的命令
ServerEvents.customCommand("opb", (event) => {
    const player = event.player;

    if (player.isCreative() && corner1 && corner2) {
        let legend = {};
        let symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ~"; // 符号数组
        let outputLines = []; // 用于存储每层的输出

        // 计算边界
        let minX = Math.min(corner1.x, corner2.x);
        let maxX = Math.max(corner1.x, corner2.x);
        let minY = Math.min(corner1.y, corner2.y);
        let maxY = Math.max(corner1.y, corner2.y);
        let minZ = Math.min(corner1.z, corner2.z);
        let maxZ = Math.max(corner1.z, corner2.z);

        // 遍历区域内的方块
        for (let z = minZ; z <= maxZ; z++) {
            let row = []; // 用于存储每一层的方块符号
            for (let y = minY; y <= maxY; y++) {
                let currentRow = ''; // 当前行的符号
                for (let x = minX; x <= maxX; x++) {
                    let blockId = event.level.getBlock(x, y, z).id;

                    if (!(blockId in legend)) {
                        if (blockId === "minecraft:air") {
                            legend[blockId] = symbols[26]; // 空气
                        } else if (blockId === "minecraft:oak_log") {
                            legend[blockId] = symbols[27]; // 橡木
                        } else {
                            legend[blockId] = symbols[Object.keys(legend).length % symbols.length];
                        }
                    }

                    currentRow += legend[blockId]; // 添加符号到当前行
                }
                row.push('"' + currentRow + '"'); // 将当前行的符号添加到行数组
            }
            outputLines.push('    .aisle(' + row.join(', ') + ')'); // 将整层的输出格式化为 .aisle() 调用
        }

        let finalString = '\n.pattern(definition => FactoryBlockPattern.start()\n' + outputLines.join('\n') + '\n'; // 组合所有层的输出

        // 添加 .where() 逻辑
        for (let key in legend) {
            let pred = '';
            switch (key) {
                case "~":
                    pred = '    .where("~", Predicates.controller(Predicates.blocks(definition.get())))\n'; // 使用 controller
                    break;
                case " ":
                    pred = '    .where(" ", Predicates.any())\n'; // 使用 any
                    break;
                default:
                    pred = '    .where("' + legend[key] + '", Predicates.blocks("' + key + '"))\n';
                    break;
            }
            finalString += pred;
        }

        // 生成文件名
        let filename = `kubejs/multiblock-pattern.txt`; // 固定文件名

        // 使用 JsonIO 写入文件
        try {
            JsonIO.write(filename, finalString.trim()); // 直接写入字符串
            
            // 进行字符串替换
            finalString = finalString.replace(/\.where\(" ", Predicates\.blocks\("minecraft:air"\)\)/g, '.where(" ", Predicates.any())');
            finalString = finalString.replace(/\.where\("~", Predicates\.blocks\("minecraft:oak_log"\)\)/g, '.where("~", Predicates.controller(Predicates.blocks(definition.get())))');

            // 写入替换后的字符串
            JsonIO.write(filename, finalString.trim());
            console.log("检测完成");
            console.log(finalString);
            sendMsg(event, "完成");
        } catch (error) {
            console.error("写入文件时出错: ", error);
            sendMsg(event, "写入文件时出错，请检查控制台。");
        }
    } else {
        sendMsg(event, "请使用木锄选择两个角落。");
    }
});