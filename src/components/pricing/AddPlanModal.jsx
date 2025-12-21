import React from 'react'
import PlanModal from './PlanModal'

const AddPlanModal = ({
  form,
  onClose,
  onChange,
  onPopularChange,
  onSubmit,
  loading,
  billingCycles,
}) => {
  return (
    <PlanModal
      form={form}
      onClose={onClose}
      onChange={onChange}
      onPopularChange={onPopularChange}
      onSubmit={onSubmit}
      loading={loading}
      isEditing={false}
      billingCycles={billingCycles}
    />
  )
}

export default AddPlanModal
