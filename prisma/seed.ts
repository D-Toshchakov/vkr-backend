import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'
import { faker } from '@faker-js/faker'
import { hash } from 'argon2'

dotenv.config()

const prisma = new PrismaClient();

const createUserAndProducts = async (quantity: number) => {
    // create user
    const pwd = await hash('123123')
    const user = await prisma.user.create({
        data: {
            email: "qwe@mail.ru",
            hash: pwd,
            name: faker.person.firstName(),
            avatarPath: faker.internet.avatar(),
        }
    })

    // create categories
    const categories: { name: string, slug: string }[] = [
        { name: "electronics", slug: 'electronics' },
        { name: 'industrial', slug: 'industrial' },
        { name: 'games', slug: 'games' },
        { name: "home", slug: 'home' },
        { name: 'clothing', slug: 'clothing' },
        { name: 'tools', slug: 'tools' },
        { name: 'movies', slug: 'movies' },
    ]
    await prisma.category.createMany({ data: categories })

    // create products
    const products: Product[] = []

    for (let i = 0; i < quantity; i++) {
        const productName = faker.commerce.productName()
        console.log(productName);

        const product = await prisma.product.create({
            data: {
                name: productName,
                description: faker.lorem.paragraph(),
                price: +faker.commerce.price({ min: 10, max: 999, dec: 0 }),
                slug: faker.helpers.slugify(productName),
                images: Array.from({
                    length: faker.number.int({ min: 2, max: 6 })
                })
                    .map(() => {
                        let url = faker.image.urlLoremFlickr({
                            width: 640,
                            height: 480
                        })
                        console.log(url);
                        return url
                    }),
                category: {
                    connect: { name: categories[i % categories.length].name }
                },
                reviews: {
                    create: [
                        {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            text: faker.lorem.sentence(),
                            user: {
                                connect: { id: user.id }
                            }
                        },
                        {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            text: faker.lorem.sentence(),
                            user: {
                                connect: { id: user.id }
                            }
                        },
                        {
                            rating: faker.number.int({ min: 1, max: 5 }),
                            text: faker.lorem.sentence(),
                            user: {
                                connect: { id: user.id }
                            }
                        }
                    ]
                }

            }
        })
        products.push(product)
    }

    console.log(`Created ${products.length} products`);

}

async function main() {
    console.log('Start seeding...');
    await createUserAndProducts(10)
}

main()
    .catch(e => console.log(e))
    .finally(async () => await prisma.$disconnect())