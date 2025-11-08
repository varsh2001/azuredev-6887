import { motion } from 'motion/react';

export function FloatingOrbs() {
  const orbs = [
    { size: 300, duration: 20, delay: 0, x: '10%', y: '20%', color: 'from-purple-500/20 to-pink-500/20' },
    { size: 400, duration: 25, delay: 2, x: '70%', y: '60%', color: 'from-blue-500/20 to-cyan-500/20' },
    { size: 250, duration: 18, delay: 4, x: '80%', y: '10%', color: 'from-violet-500/20 to-fuchsia-500/20' },
    { size: 350, duration: 22, delay: 1, x: '20%', y: '70%', color: 'from-indigo-500/20 to-blue-500/20' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
