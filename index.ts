let t = 0;
let x = 96;
let y = 24;

globalThis.TIC = function TIC() {
	if (btn(0)) y--;
	if (btn(1)) y++;
	if (btn(2)) x--;
	if (btn(3)) x++;
	cls(13);
	spr(1 + floorDivision(t % 60, 30) * 2, x, y, 14, 3, 0, 0, 2, 2);
	print("HELLO WORLD!", 84, 84);
	t++;
};

declare const floorDivision: LuaFloorDivision<number, number, number>;
