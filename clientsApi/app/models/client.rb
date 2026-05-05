class Client < ApplicationRecord
  validates :name, presence: true
  validates :phone, format: { with: /\A\d+\z/, message: "apenas deve conter dígitos numéricos" }, presence: true
end
