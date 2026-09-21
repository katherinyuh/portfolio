import type Matter from "matter-js";

export interface Pointer {
  x: number;
  y: number;
  /** Where it was a frame ago. */
  px: number;
  py: number;
  /** False until it has been seen on the page at all, so the first move isn't taken for a fast one. */
  seen: boolean;
}

/** How far past an orb's edge the pointer still reaches it, in px. */
export const PUSH_REACH = 88;

/**
 * Gives the orbs a shove where the pointer has just moved through them: away from it, and the way it was going, harder
 * the faster it went and the closer it is. A pointer that isn't moving does nothing, so the orbs settle when you stop.
 */
export function pushOrbs(body: typeof Matter.Body, orbs: Matter.Body[], radius: number, pointer: Pointer) {
  const dx = pointer.x - pointer.px;
  const dy = pointer.y - pointer.py;
  pointer.px = pointer.x;
  pointer.py = pointer.y;
  const speed = Math.hypot(dx, dy);
  if (!pointer.seen || speed < 0.5 || speed > 400) return; // still, or a jump (it came back into the window)
  const mx = dx / speed;
  const my = dy / speed;
  const reach = radius + PUSH_REACH;
  const strength = Math.min(speed, 45) * 0.2;

  for (const orb of orbs) {
    const ox = orb.position.x - pointer.x;
    const oy = orb.position.y - pointer.y;
    const distance = Math.hypot(ox, oy);
    if (distance >= reach) continue;
    const near = 1 - distance / reach; // 1 at the middle of the orb, 0 at the edge of the pointer's reach
    const away = distance > 0.01 ? { x: ox / distance, y: oy / distance } : { x: 0, y: -1 };
    const kick = strength * (0.35 + near);
    body.setVelocity(orb, {
      x: orb.velocity.x + (away.x * 0.6 + mx) * kick,
      y: orb.velocity.y + (away.y * 0.6 + my) * kick,
    });
    // a glancing push sets it turning a little: the side of the orb the pointer went past decides which way
    body.setAngularVelocity(orb, orb.angularVelocity + (mx * oy - my * ox) * 0.00006 * near * Math.min(speed, 30));
  }
}
