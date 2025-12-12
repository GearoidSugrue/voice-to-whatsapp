import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthTokenTestComponent from '../test/AuthTokenTestComponent.vue'

describe('useAuthToken', () => {
  it('persists and restores from localStorage via a component', async () => {
    const wrapper = mount(AuthTokenTestComponent)
    // set via composition ref
    wrapper.vm.authToken = 'secret-123'
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem('polisherSecret')).toBe('secret-123')

    // remount to simulate fresh usage
    const wrapper2 = mount(AuthTokenTestComponent)
    await wrapper2.vm.$nextTick()
    expect(wrapper2.vm.authToken).toBe('secret-123')
  })
})
