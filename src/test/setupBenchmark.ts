import { beforeAll } from 'vitest'
import { setCpuSlowdown } from './cpuSlowdown'

// A normal laptop is slower than a developer's machine, and 2x is closer to it than 4x
const benchmarkCpuSlowdown = 2

beforeAll(async () => {
  await setCpuSlowdown(benchmarkCpuSlowdown)
})
