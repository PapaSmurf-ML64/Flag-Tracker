import bitwise from "bitwise";
import { UInt8 } from "bitwise/types";

export class BitFlag {
byte: number;
bit: number;
set: number;

constructor(byte: number, bit: number, set: number) {
 this.byte = byte;
  this.bit = bit;
  this.set = set;
}
}

export function parseFlagChanges(incoming: Buffer, storage: Buffer): BitFlag[] {
let f: BitFlag[] = [];
for (let i = 0; i < incoming.byteLength; i++) {
  let bits_i = bitwise.byte.read(incoming[i] as UInt8);
  let bits_s = bitwise.byte.read(storage[i] as UInt8);
  for (let j = 0; j < bits_i.length; j++) {
    if (bits_i[j] !== bits_s[j]) {
      f.push(new BitFlag(i, j, bits_i[j]));
      bits_s[j] = bits_i[j];
      let b = bitwise.byte.write(bits_s);
      storage.writeUInt8(b, i);
    }
  }
}
return f;
}