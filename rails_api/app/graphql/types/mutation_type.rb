# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :delete_bookmark, mutation: Mutations::DeleteBookmark
    field :create_bookmark, mutation: Mutations::CreateBookmark
    field :update_bookmark, mutation: Mutations::UpdateBookmark
  end
end
