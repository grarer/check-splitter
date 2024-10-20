export function impossible(x: never): never {
    throw new Error("unreachable");
}