//可以写在startup_scripts中的machine.js
GTCEuStartupEvents.registry("gtceu:machine", event => {
event.create("large_infuser", "multiblock")//这是你注册多方块机器的id
        .rotationState(RotationState.ALL)
        .recipeType("large_infuser")//执行的配方id
        .recipeModifier(GTRecipeModifiers.ELECTRIC_OVERCLOCK.apply(OverclockingLogic(1, 4)))//配方的执行模式，例如能升压
        .appearanceBlock(GTBlocks.CASING_STEEL_SOLID)//也可以写成.appearanceBlock(() => Block.getBlock("iald:deepvioletgleamblock")),iald:deepvioletgleamblock是你想设置的方块
        .pattern((definition) =>
            FactoryBlockPattern.start()//多方块结构,可以使用群里的MBHelps.js或者来找我要(QQ:2053345890)或者使用网页提供的js文件
                .aisle("bbb", "bbb", "bbb")
                .aisle("bbb", "bcb", "bbb")
                .aisle("bbb", "bab", "bbb")
                .where("a", Predicates.controller(Predicates.blocks(definition.get())))//设置主方块机器所在的位置
                .where("b", Predicates.blocks("gtceu:steel_machine_casing")//设置结构使用的方块
                    .setMinGlobalLimited(10)
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))//可以替换的方块，比如能源仓,这里是物品输入仓
                    .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))//物品输出仓
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))//流体输入仓
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))//流体输出仓
                    .or(Predicates.abilities(PartAbility.PARALLEL_HATCH).setMaxGlobalLimited(1))//并行仓
                    .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMaxGlobalLimited(2)))//能源仓
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))//维护仓
                    //对于其他仓，请自行寻找
                .where("c", Predicates.blocks("gtceu:bronze_pipe_casing"))//设置结构使用的方块
                .build())
        .workableCasingRenderer("gtceu:block/casings/steam/steel/side", "gtceu:block/multiblock/gcym/large_maceration_tower", true)//设置机器主方块的外观
})
//可以放在startup_scripts的machine.js文件中
//下面是注册多方块机器的配方
GTCEuStartupEvents.registry("gtceu:recipe_type", event => {
    event.create("stellar_forge")//注册的配方id，和你注册的多方块机器中的.recipeType("large_infuser")""一样
        .setEUIO("in")
        .setSlotOverlay(false, false, GuiTextures.SOLIDIFIER_OVERLAY)
        .setMaxIOSize(3, 2, 9, 2)//设置输入和输出。3,2都是物品的输入输出。9,2是流体的输入输出
        .setProgressBar(GuiTextures.PROGRESS_BAR_ARC_FURNACE, FillDirection.LEFT_TO_RIGHT)
        .setSound(GTSoundEntries.ARC)//jei查看的配方界面
})
//下面是注册的多方块机器和配方的语言文件的编辑，可以写在assets中的kubejs中的lang/zh_cn.json中
{
 "gtceu.create_aggregation_hoshizora": "§9§o☆星空☆§5创造聚合仪",//注册的配方名称
 "block.gtceu.create_aggregation_hoshizora": "§9§o☆星空☆§5创造聚合仪",//注册的多方块机器名称
}