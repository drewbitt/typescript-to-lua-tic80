/*
Prevents using a module for TIC() as TIC-80 will not find `local function TIC()` without it being included globally
Also add for OVR, SCN, MENU, BOOT, BDR as needed
*/
const global = globalThis as typeof globalThis & { TIC: () => void };
if (global.TIC === undefined) {
	global.TIC = () => TIC();
}

let t = 0;
let x = 96;
let y = 24;

function TIC() {
	if (btn(0)) y--;
	if (btn(1)) y++;
	if (btn(2)) x--;
	if (btn(3)) x++;
	cls(13);
	spr(1 + floorDivision(t % 60, 30) * 2, x, y, 14, 3, 0, 0, 2, 2);
	print("HELLO WORLD!", 84, 84);
	t++;
}

declare const floorDivision: LuaFloorDivision<number, number, number>;

/**
 Metadata
 title:  game title
 author: drewbitt
 desc:   short description

 <TILES>
 001:eccccccccc888888caaaaaaaca888888cacccccccacc0ccccacc0ccccacc0ccc
 002:ccccceee8888cceeaaaa0cee888a0ceeccca0ccc0cca0c0c0cca0c0c0cca0c0c
 003:eccccccccc888888caaaaaaaca888888cacccccccacccccccacc0ccccacc0ccc
 004:ccccceee8888cceeaaaa0cee888a0ceeccca0cccccca0c0c0cca0c0c0cca0c0c
 017:cacccccccaaaaaaacaaacaaacaaaaccccaaaaaaac8888888cc000cccecccccec
 018:ccca00ccaaaa0ccecaaa0ceeaaaa0ceeaaaa0cee8888ccee000cceeecccceeee
 019:cacccccccaaaaaaacaaacaaacaaaaccccaaaaaaac8888888cc000cccecccccec
 020:ccca00ccaaaa0ccecaaa0ceeaaaa0ceeaaaa0cee8888ccee000cceeecccceeee
 </TILES>

 <WAVES>
 000:00000000ffffffff00000000ffffffff
 001:0123456789abcdeffedcba9876543210
 002:0123456789abcdef0123456789abcdef
 </WAVES>

 <SFX>
 000:000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000304000000000
 </SFX>

 <PALETTE>
 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
 </PALETTE>

 <TRACKS>
 000:100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
 </TRACKS>
 */
function addMetadata() {/* Empty method for hack to add TIC-80 metadata to lua */}
