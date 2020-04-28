import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface IRequest {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: IRequest): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    let category = await categoriesRepository.findOne({ where: { title } });

    if (!category) {
      category = await categoriesRepository.create({ title });
      await categoriesRepository.save(category);
    }

    return category;
  }
}

export default CreateCategoryService;
