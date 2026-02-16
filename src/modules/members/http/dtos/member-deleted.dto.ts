export const MemberDeletedDto = {
  from(data: { success: boolean; orgId: string; userId: string }) {
    return {
      success: data.success,
      orgId: data.orgId,
      userId: data.userId,
    }
  },
}
